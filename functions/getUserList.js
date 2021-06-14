'use strict'

module.exports.handle = async (event) => {
  const utils = require('./modules/utils')
  const DbManager = require('./modules/dbManager')
  const DB = new DbManager()

  //あとでpaginationするかも
  try {
    let userList = await DB.getUserList()
    return utils.getResponseData(userList)
  }
  catch (e) {
    return utils.getResponseData("dynamo-query-error")
  }

}
