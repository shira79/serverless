'use strict';

module.exports.handle = async (event) => {
  const axios = require('axios');

  //Twitterの公式アカウントのid
  var myUserId = '783214';
  var bearerToken = process.env['BEARER_TOKEN'];

  const options =
  {
    headers: {
      'Content-Type': 'application/json',
      'charset': 'utf-8',
      'Authorization': 'Bearer ' + bearerToken,
    }
  }

  var url = 'https://api.twitter.com/2/users/' + myUserId + '?user.fields=public_metrics'

  return axios.get(url, options)
  .then(function(response) {
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: response.data,
        },
      ),
    };
  })
  .catch(function(error) {
    return error;
  });

};
