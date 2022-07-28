'use strict'

module.exports.handle = async (event) => {
  const utils = require('./modules/utils')
  const DbManager = require('./modules/dbManager')
  const DB = new DbManager()

  try {
    let result = await DB.getCountData(event.pathParameters.id)
    return utils.getResponseData(result)
  }
  catch (e) {
    console.log(e)
    return utils.getResponseData("dynamo-query-error")
  }

}
