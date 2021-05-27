'use strict';

module.exports.handle = async (event) => {
  var AWS = require('aws-sdk');
  require('date-utils');
  const utils = require('./modules/utils');

  var dynamoClient = new AWS.DynamoDB.DocumentClient({region:process.env['REGION']});

  var body = utils.getBody(event.body);

  //既にuserが登録されているか確認
  var queryParams = {
    TableName: process.env['TABLE_NAME'],
    KeyConditionExpression: "#user_id = :id and begins_with (#date, :user_prefix)",
    ExpressionAttributeNames:{
      "#user_id": "user_id",
      "#date": "date"
    },
    ExpressionAttributeValues: {
      ":id": body.id,
      ":user_prefix": "user#",
    }
  };

  //既に登録済みだったら、returnする
  var queryResult = await dynamoClient.query(queryParams).promise();

  if(queryResult.Count > 0){
    return utils.getResponseData("already registered")
  }

  //put用のデータを作成する
  var dt = new Date();
  var now = await dt.toFormat("YYYY-MM-DD-HH24-MI-SS");

  var putItem = {
    user_id:body.id,
    date:'user#' + now,
    username:body.username,
    name:body.name,
  };

  var putParams = {
    TableName: process.env['TABLE_NAME'],
    Item: putItem
  };

  // put実行
  try {
    await dynamoClient.put(putParams).promise();
  }
  catch (e) {
    return utils.getResponseData("dynamo-put-error")
  }

  return utils.getResponseData({'item':putItem})

};
