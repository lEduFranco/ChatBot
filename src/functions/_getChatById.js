let client = [];

async function _getChatById(number) {
  return new Promise(async (resolve) => {
      try {
          let a = await client.getChatById(number)
          resolve(a)
      } catch (error) {
          resolve(undefined)
      }
  })
}
export default _getChatById;
