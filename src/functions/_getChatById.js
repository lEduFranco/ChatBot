let client = [];

async function _getChatById(number) {
  return new Promise(async (resolve) => {
      try {
          let a = await global.client.getChatById(number)
          resolve(a)
      } catch (error) {
          resolve(undefined)
      }
  })
}
module.exports = _getChatById;
