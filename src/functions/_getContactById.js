let client = [];

async function _getContactById(number) {
  return new Promise(async (resolve) => {
      try {
          let a = await client.getContactById(number)
          resolve(a)
      } catch (error) {
          resolve(undefined)
      }
  })
}
export default _getContactById;
