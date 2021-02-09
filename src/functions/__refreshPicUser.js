import _openCon from './_openCon';

async function __refreshPicUser(data) {
  try {
      return new Promise(async (resolve) => {
          const conn = await _openCon()
          conn.promise().query("UPDATE tbLeads SET imgCliente='" + data.url + "' WHERE idInt='" + data.idInt + "'").then(async () => {
              resolve(true)
          })
      })
  } catch (error) {
      console.log(error)
  }
}
export default __refreshPicUser;
