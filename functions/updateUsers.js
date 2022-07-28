'use strict'

module.exports.handle = async (event) => {
  const utils = require('./modules/utils')
  const DbManager = require('./modules/dbManager')
  const DB = new DbManager()

  try {
    //ユーザーリストを取得
    let userList = await DB.getUserList()

    //並列で更新処理を実行する
    await Promise.all(userList.Items.map(async user => {
      return DB.storeUserData(user.id)
    }))

    return utils.getResponseData("done")

  }
  catch (e) {
    console.log(e)
    return utils.getResponseData({error:e})
  }

}
