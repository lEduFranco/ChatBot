const _openCon = require('./_openCon');
const _getContactsSaved = require('./_getContactsSaved');
const _getLeads = require('./_getLeads');
const _sendLog = require('./_sendLog');

async function _saveContacts() {
  try {
      const conn = await _openCon();
      let contacts = await global.client.getContacts();
      let contacts_ = await _getContactsSaved()
      var run = false
      let obj = []
      var saveName = config.saveName
      var n = ''
      const promises = contacts.map(async (element, idx) => {
          if (!element.isGroup && element.number != null && element.id.server == 'c.us') {
              var nomeContato = element.name == undefined ? '' : element.name
              var nomeWhats = element.pushname
              if (element.isBusiness) {
                  nomeWhats = element.verifiedName != undefined ? element.verifiedName : ''
              }
              var salvo = element.isMyContact ? '1' : '0'
              var picUser = '';
              if (saveName == '1') {
                  n = nomeContato != '' ? nomeContato : (nomeWhats != '' ? nomeWhats : '')
              }
              var ag = element.isWAContact ? '1' : '0'
              if (contacts_.length > 0) {
                  var result = contacts_.findIndex((e) => e.idInt == element.id._serialized && element.id.server == 'c.us')
                  if (result == -1) {
                      obj.push([global.idBot, element.id._serialized, 1, n, element.number, picUser, salvo, ag, new Date(Date.now()), 1])
                  }
              } else {
                  obj.push([global.idBot, element.id._serialized, 1, n, element.number, picUser, salvo, ag, new Date(Date.now()), 1])
              }
          }
      })
      await Promise.all(promises);
      if (obj.length > 0) {
          await conn.promise().query('INSERT INTO tbLeads (idBot, idInt, statusCliente, nomeCliente, telefoneCliente, imgCliente, agenda, valido, dataCad, acTransmissao) VALUES ?', [obj]).catch(console.log).then();
      }
      await _getLeads()
      // await _savePhotos()
  } catch (error) {
      console.log(error)
  } finally {
      _sendLog('...beleza...estou pronto para começar!...')
  }
}
module.exports = _saveContacts;
