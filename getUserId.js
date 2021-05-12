'use strict';

module.exports.getUserId = async (event) => {
  const axios = require('axios');

  var bearerToken = process.env['BEARER_TOKEN'];

  const options =
  {
    headers: {
      'Content-Type': 'application/json',
      'charset': 'utf-8',
      'Authorization': 'Bearer ' + bearerToken,
    }
  }

  var userName = event.pathParameters.userName;
  var url = 'https://api.twitter.com/2/users/by/username/' + userName;

  return axios.get(url, options)
  .then(function(response) {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET'
    },
      body: JSON.stringify(
        {
          content: response.data,
        },
      ),
    };
  })
  .catch(function(error) {
    return error;
  });

};
