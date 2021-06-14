'use strict'

module.exports.handle = async (event) => {
  const utils = require('./modules/utils')
  const DbManager = require('./modules/dbManager')
  const DB = new DbManager()

  let body = utils.getBody(event.body)

  try {
    //既に登録済みだったら、returnする
    let queryResult = await DB.getUser(body.id)
    if(queryResult.Count > 0){
      return utils.getResponseData("already registered")
    }
  }
  catch (e) {
    return utils.getResponseData("dynamo-query-error")
  }

  // put実行
  try {
    await DB.storeUser(body)
    await DB.storeCountData(body.id)
    return utils.getResponseData({id:body.id})
  }
  catch (e) {
    return utils.getResponseData("dynamo-put-error")
  }

}
