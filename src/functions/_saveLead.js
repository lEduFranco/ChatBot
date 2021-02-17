const _openCon = require('./_openCon');

async function _saveLead(data, exist) {
  try {
      return new Promise(async (resolve) => {
          const conn = await _openCon();
          if (!exist) {
              var gender = data.gender == 'male' ? 0 : 1
              await conn.promise().query('INSERT INTO tbLeads SET idBot=' + global.idBot + ', idInt="' + data.idInt + '", statusCliente=1, nomeCliente="' + data.nomeCliente + '", sexoCliente="' + gender + '", telefoneCliente="' + data.telefoneCliente + '", imgCliente="' + data.imgCliente + '", dataCad=NOW(), acTransmissao=1').then(([result]) => {
                global.leads.push({ 'id': result.insertId, 'idInt': data.idInt, 'nomeCliente': data.nomeCliente, 'statusCliente': 1 })
                  resolve({ id: result.insertId })
              }).catch(console.log);
          } else {
              var uid = global.leads[data.idl].id
              var gender = data.gender == 'male' ? 0 : 1
              global.leads[data.idl].nomeCliente = data.nomeCliente
              global.leads[data.idl].statusCliente = 1
              var nomeEscape = data.nomeCliente.replace(/['"]+/g, '')
              await conn.promise().query('UPDATE tbLeads SET statusCliente = 1, nomeCliente="' + nomeEscape + '", sexoCliente="' + gender + '" WHERE id=' + uid + ' AND idBot=' + global.idBot + '').catch(console.log).then(() => {
                  resolve({ id: uid })
              });
          }
      })
  } catch (error) {
      console.log(error)
  }
}
module.exports = _saveLead;
