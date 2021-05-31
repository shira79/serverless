'use strict';

module.exports.handle = async (event) => {
  var AWS = require('aws-sdk');
  const utils = require('./modules/utils');

  var dynamoClient = new AWS.DynamoDB.DocumentClient({region:process.env['REGION']});

  var queryParams = {
    TableName: process.env['TABLE_NAME'],
    KeyConditionExpression: "#type = :type",
    ExpressionAttributeNames:{
      "#type": "type",
    },
    ExpressionAttributeValues: {
      ":type": 'user',
    }
  };

  //あとでpagenationもするかも
  // query実行
  try {
    var queryResult = await dynamoClient.query(queryParams).promise();
    return utils.getResponseData(queryResult)
  }
  catch (e) {
    return utils.getResponseData("dynamo-query-error")
  }

};
