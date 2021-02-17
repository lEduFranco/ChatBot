async function _getContactById(number) {
  return new Promise(async (resolve) => {
      try {
          let a = await global.client.getContactById(number)
          resolve(a)
      } catch (error) {
          resolve(undefined)
      }
  })
}
module.exports = _getContactById;
