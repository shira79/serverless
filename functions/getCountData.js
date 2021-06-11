'use strict';

module.exports.handle = async (event) => {
  let AWS = require('aws-sdk');
  const utils = require('./modules/utils');

  let dynamoClient = new AWS.DynamoDB.DocumentClient({region:process.env['REGION']});

  let queryParams = {
    TableName: process.env['TABLE_NAME'],
    KeyConditionExpression: "#type = :type and begins_with (#id_date, :id)",
    ExpressionAttributeNames:{
      "#type": "type",
      "#id_date": "id_date"
    },
    ExpressionAttributeValues: {
      ":type": 'count',
      ":id": event.pathParameters.id + '_',
    }
  };

  try {
    let queryResult = await dynamoClient.query(queryParams).promise();
    return utils.getResponseData(queryResult)
  }
  catch (e) {
    return utils.getResponseData("dynamo-query-error")
  }

};
