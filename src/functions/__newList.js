const _openCon = require('./_openCon');
const _getLeads = require('./_getLeads');
const __checkAllowMessage = require('./__checkAllowMessage');
const _timerLists = require('./_timerLists');

var authenticated = false;
var sendListTimer = false;
var idBot = 0;
let sendList = [];

async function __newList(data) {
  try {
      return new Promise(async function (resolve, reject) {
          if ("name" in data && "dateout" in data && "recipients" in data && "template" in data) {
              if (data.recipients != null) {
                  const conn = await _openCon()
                  await _getLeads()
                  var recipients = []
                  var template = data.template
                  for (let a of data.recipients) {
                      //var phone = await __getValidPhone(checkPhone(a.phone))
                      var phone = a.phone;
                      if (__checkAllowMessage(phone)) {
                          let bc = recipients.filter((e) => e.phone == phone)
                          if (bc.length == 0) {
                              recipients.push({ name: a.name, phone: phone })
                          }
                      }
                  }
                  var size = recipients.length
                  if (size > 0) {
                      await conn.promise().query('INSERT INTO tbLists SET idBot=' + idBot + ', name="' + data.name + '", dateIn=NOW(), dateOut="' + data.dateout + '"; INSERT INTO tbRecipients SET idBot=' + idBot + ', idList=LAST_INSERT_ID(), data=' + conn.escape(JSON.stringify(recipients)) + ', size=' + size + '').then(async ([result]) => {
                          var idList = result[0].insertId
                          await conn.promise().query('INSERT INTO tbTemplates SET idBot=' + idBot + ', idList=' + idList + ', body=' + conn.escape(template.body.trim()) + ',images=' + conn.escape(JSON.stringify(template.urlImages)) + ' , date=NOW(), status=0').then(() => {
                              if (authenticated) {
                                  sendList.push({ id: idList, dateOut: new Date(data.dateout).getTime() })
                                  if (!sendListTimer) {
                                      _timerLists()
                                  }
                              }
                              resolve({ 'status': 1, 'response': 'success', 'id': idList, 'recipients': size })
                          }).catch((error) => reject(error))
                      }).catch((error) => reject(error))
                  } else {
                      resolve({ 'status': 0, 'response': 'error', 'description': 'check if your recipients allow you to send messages or recipients is valid' })
                  }
              } else {
                  resolve({ 'status': 0, 'response': 'error', 'description': 'recipients is null' })
              }
          } else {
              resolve({ 'status': 0, 'response': 'error', 'description': 'field not found' })
          }
      })
  } catch (error) {
      reject(error)
  }
}
module.exports = __newList;
