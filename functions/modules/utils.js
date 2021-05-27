
exports.getBody = function(requestBody)
{
  if(requestBody == undefined){
    return {}
  }else{
    return JSON.parse(requestBody)
  }
}

exports.getResponseData = function(responseBody)
{
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
      'Access-Control-Allow-Headers' : 'Content-Type',
    },
    body: JSON.stringify(responseBody)
  }
}