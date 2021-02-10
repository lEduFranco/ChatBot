const _openCon = require('./_openCon');
const _loadChat = require('./_loadChat');

const portBot = process.env.PORTBOT

var idBot = 0;

let attendants = []
let initiated = []

const http = require('http').Server(app);
const io = require('socket.io')(http, {
  path: '/' + portBot + '/socket.io', cors: {
      origin: '*',
  }
});


async function _newTicket(data) {
  // console.log(data)
  try {
      const conn = await _openCon();
      await conn.promise().query('SELECT id, idInt FROM tbLeads WHERE idInt="' + data.idInt + '" AND idBot=' + idBot + '').then(async ([rows, fields]) => {
          if (rows.length == 0) {
              await conn.promise().query('INSERT INTO tbLeads SET idBot=' + idBot + ', idInt="' + data.idInt + '", nomeCliente="' + data.nomeCliente + '", telefoneCliente="' + data.telefoneCliente + '", imgCliente="' + data.imgCliente + '", dataCad=NOW()').then(async (
                  result
              ) => {
                  result = result[0]
                  var _idCliente = result.insertId
                  await conn.promise().query('INSERT INTO tbTickets SET idBot=' + idBot + ', idLead="' + result.insertId + '", dataInicio=NOW(), idEtapa=0, idStatus=0, idCanal=0, idSetor="' + data.idSetor + '", idSubSetor="' + data.idSubSetor + '"').then(async (result2) => {
                      result2 = result2[0]
                      var idTicket = result2.insertId
                      initiated[data.id].idTicket = idTicket
                      let obj = []
                      let msg = await _loadChat(data.idInt)
                      obj.push({
                          'chat': {
                              'id': idTicket,
                              'idLead': _idCliente,
                              'dataInicio': Date.now(),
                              'idSetor': data.idSetor,
                              'idAtend': 0,
                              'idInt': data.idInt,
                              'nomeCliente': data.nomeCliente,
                              'telefoneCliente': data.telefoneCliente,
                              'imgCliente': data.imgCliente
                          },
                          'mensagens': msg.messages
                      })
                      const promises = attendants.map(async (e, i) => {
                          var dAtendente = e.setores.findIndex(e => e == data.idSetor);
                          if (dAtendente != -1) {
                              io.of('/' + portBot).to(e.idSocket).emit('entrada', JSON.stringify(obj))
                          }
                      })
                      await Promise.all(promises)
                  }).catch(console.log);
              }).then(() => { }).catch(console.log)
          } else {
              await conn.promise().query('INSERT INTO tbTickets SET idBot=' + idBot + ', idLead="' + rows[0].id + '", dataInicio=NOW(), idEtapa=0, idStatus=0, idCanal=0, idSetor="' + data.idSetor + '", idSubSetor="' + data.idSubSetor + '", idAtend="' + data.idAtend + '"').then(async (result) => {
                  result = result[0]
                  let obj = []
                  initiated[data.id].idTicket = result.insertId
                  let msg = await _loadChat(data.idInt)
                  obj.push({
                      'chat': {
                          'id': result.insertId,
                          'idLead': rows[0].id,
                          'dataInicio': Date.now(),
                          'idSetor': data.idSetor,
                          'idAtend': data.idAtend,
                          'idInt': data.idInt,
                          'nomeCliente': data.nomeCliente,
                          'telefoneCliente': data.telefoneCliente,
                          'imgCliente': data.imgCliente
                      },
                      'mensagens': msg.messages
                  })
                  const promises = attendants.map(async (e, i) => {
                      if (e.idAtendente == data.idAtend) {
                          io.of('/' + portBot).to(e.idSocket).emit('entrada', JSON.stringify(obj))
                      }
                  })
                  await Promise.all(promises)
              }).catch(console.log).then();
          }
      }).catch(console.log)
          .then();
  } catch (error) {
      console.log(error)
  }
}
module.exports = _newTicket;
