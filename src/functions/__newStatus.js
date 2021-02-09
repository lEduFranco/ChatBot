import _openCon from './_openCon';
import _timerStatus from './_timerStatus';

var idBot = 0;

var authenticated = false;
var sendStatusTimer = false;

let sendStatus = [];

async function __newStatus(data) {
  try {
      return new Promise(async function (resolve, reject) {
          if ("name" in data && "text" in data) {
              const conn = await _openCon()
              await conn.promise().query('INSERT INTO tbStatus SET idBot=' + idBot + ', name="' + data.name + '", text="' + data.text + '", image="' + data.image + '", dateIn=NOW(), dateOut="' + data.dateout + '"').then(async ([result]) => {
                  var idStatus = result.insertId
                  if (authenticated) {
                      sendStatus.push({ id: idStatus, dateOut: new Date(data.dateout).getTime() })
                      if (!sendStatusTimer) {
                          _timerStatus()
                      }
                  }
                  resolve({ 'status': 1, 'response': 'success', 'id': idStatus })
              })
          } else {
              resolve({ 'status': 0, 'response': 'error', 'description': 'field not found' })
          }
      })
  } catch (error) {
      console.log(error)
  }
}
export default __newStatus;
