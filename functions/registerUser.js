'use strict';

module.exports.handle = async (event) => {
  let AWS = require('aws-sdk');
  require('date-utils');
  const utils = require('./modules/utils');

  let dynamoClient = new AWS.DynamoDB.DocumentClient({region:process.env['REGION']});

  let body = utils.getBody(event.body);

  //既にuserが登録されているか確認
  let queryParams = {
    TableName: process.env['TABLE_NAME'],
    KeyConditionExpression: "#type = :type and begins_with (#id_date, :id)",
    ExpressionAttributeNames:{
      "#type": "type",
      "#id_date": "id_date"
    },
    ExpressionAttributeValues: {
      ":type": 'user',
      ":id": body.id + '_',
    }
  };

  //既に登録済みだったら、returnする
  let queryResult = await dynamoClient.query(queryParams).promise();

  if(queryResult.Count > 0){
    return utils.getResponseData("already registered")
  }

  //put用のデータを作成する
  let dt = new Date();
  let now = dt.toFormat("YYYY-MM-DD-HH24-MI-SS");

  let putItem = {
    type:'user',
    id_date: body.id + '_' + now,
    id: body.id,
    date: now,
    username:body.username,
    name:body.name,
  };

  let putParams = {
    TableName: process.env['TABLE_NAME'],
    Item: putItem
  };

  // put実行
  try {
    await dynamoClient.put(putParams).promise();
    return utils.getResponseData({'item':putItem})
  }
  catch (e) {
    return utils.getResponseData("dynamo-put-error")
  }

};
