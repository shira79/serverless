'use strict';

module.exports.handle = async (event) => {
  let AWS = require('aws-sdk');
  const axios = require('axios');
  const utils = require('./modules/utils');
  require('date-utils');

  try {
    //ユーザーリストを取得
    let userList = await getUserList();

    //並列で登録処理を実行する
    await Promise.all(userList.Items.map(async user => {
      let apiResponse = await getUserDataFromTwitter(user.id)
      let twitterUserData = apiResponse.data.data
      return storeCountData(twitterUserData)
    }));

    return utils.getResponseData("done")

  }
  catch (e) {
    return utils.getResponseData(e)
  }

  /**
   * dynamoDBからuserのリストを取得する
   */
  function getUserList(){
    let dynamoClient = new AWS.DynamoDB.DocumentClient({region:process.env['REGION']});

    let queryParams = {
      TableName: process.env['TABLE_NAME'],
      KeyConditionExpression: "#type = :type",
      ExpressionAttributeNames:{
        "#type": "type",
      },
      ExpressionAttributeValues: {
        ":type": 'user',
      }
    };

    return dynamoClient.query(queryParams).promise()
  }

  /**
   * twitterAPIからユーザーデータを取得する
   *
   * @param string userId
   */
  function getUserDataFromTwitter(userId){
    let bearerToken = process.env['BEARER_TOKEN'];

    const options =
    {
      headers: {
        'Content-Type': 'application/json',
        'charset': 'utf-8',
        'Authorization': 'Bearer ' + bearerToken,
      }
    }

    let url = 'https://api.twitter.com/2/users/' + userId +'?user.fields=public_metrics';

    return axios.get(url, options);
  }

  /**
   *
   * @param twitterUserData
   * @returns
   */
  function storeCountData(twitterUserData){

    let dynamoClient = new AWS.DynamoDB.DocumentClient({region:process.env['REGION']});
    //put用のデータを作成する
    let dt = new Date();
    let now = dt.toFormat("YYYY-MM-DD-HH24-MI-SS");

    let putItem = {
      type:'count',
      id_date: twitterUserData.id + '_' + now,
      id: twitterUserData.id,
      date: now,
      username:twitterUserData.username,
      name:twitterUserData.name,
      public_metrics:twitterUserData.public_metrics
    };

    let putParams = {
      TableName: process.env['TABLE_NAME'],
      Item: putItem
    };

    // put実行
    return dynamoClient.put(putParams).promise();
  }

};
