let client = [];

async function __getValidPhone(phone) {
  try {
      return new Promise(async resolve => {
          let a = await client.getNumberId(phone).then((e) => {
              if (e != null) {
                  resolve(e._serialized)
              } else {
                  resolve(null)
              }
          })
      })
  } catch (error) {
      console.log(error)
      resolve(null)
  }
}
module.exports = __getValidPhone;
