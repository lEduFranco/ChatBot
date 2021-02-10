const _openCon = require('./_openCon');

async function __spamRequest(ip) {
  return new Promise(async (resolve) => {
      try {
          const conn = await _openCon()
          conn.promise().query("SELECT id FROM tbRequests WHERE ip='" + ip + "' AND DATE(dataIn) = CURDATE()").then(([result]) => {
              if (result.length < 5) {
                  resolve(false)
              } else {
                  resolve(true)
              }
          })
      } catch (error) {
          console.log(error)
          resolve(true)
      }
  })
}
module.exports = __spamRequest;
