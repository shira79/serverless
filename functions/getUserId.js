'use strict'

module.exports.handle = async (event) => {
  const axios = require('axios')
  const utils = require('./modules/utils')

  let bearerToken = process.env['BEARER_TOKEN']

  const options =
  {
    headers: {
      'Content-Type': 'application/json',
      'charset': 'utf-8',
      'Authorization': 'Bearer ' + bearerToken,
    }
  }

  if(event.pathParameters == undefined) return utils.getResponseData('username is undefined')

  let url = 'https://api.twitter.com/2/users/by/username/' + event.pathParameters.userName + '?user.fields=profile_image_url'

  return axios.get(url, options)
  .then(function(response) {
    return utils.getResponseData(response.data.data)
  })
  .catch(function(error) {
    return utils.getResponseData(error)
  })

}
