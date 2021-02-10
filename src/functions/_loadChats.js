const _openCon = require('./_openCon');
const _getContactById = require('./_getContactById');
const _checkNull = require('./_checkNull');
const getGender = require('./getGender');
const _saveLead = require('./_saveLead');
const _loadChat = require('./_loadChat');
const __getAttendant = require('./__getAttendant');

let client = [];
let initiated = [];

var idBot = 0;

async function _loadChats(data) {
  try {
      return new Promise(async (resolve) => {
          const conn = await _openCon();
          var idAtend = data.idAtendente
          let sectors = data.setores
          let obj = []
          if (idAtend != 0) {
              await conn.promise().query('SELECT ti.* , tle.id as idBot, tle.idInt as idInt, tle.nomeCliente, tle.telefoneCliente, tle.imgCliente, tw.aid FROM tbTickets ti INNER JOIN tbLeads tle ON ti.idLead=tle.id LEFT JOIN tbAttendants_wallet tw ON tle.id = tw.lid  WHERE (ti.idAtend IN (' + idAtend + ',0)) AND ti.idSetor IN (' + sectors + ',0) AND ti.idStatus != 2 AND ti.idBot=' + idBot + ' ORDER BY ti.id DESC ').then(async ([rows, fields]) => {
                  if (rows.length > 0) {
                      const promises = rows.map(async (e, i) => {
                          var img = rows[i].imgCliente
                          if (img == null || img == '') {
                              rows[i].imgCliente = await client.getProfilePicUrl(rows[i].idInt)
                          }
                          if (rows[i].nomeCliente == null || rows[i].nomeCliente == '') {
                              var nome = ''
                              let contato = await _getContactById(rows[i].idInt)
                              if (contato != undefined) {
                                  if (contato.isBusiness) {
                                      nome = _checkNull(contato.verifiedName) ? contato.verifiedName : ''
                                  } else {
                                      nome = _checkNull(contato.pushname) ? contato.pushname : ''
                                  }
                                  if (nome != null || nome != '' && nome.length >= 3) {
                                      rows[i].nomeCliente = nome
                                      var idl = leads.findIndex((e) => e.idInt == rows[i].idInt)
                                      var gender = getGender(nome)
                                      let obj = { 'idInt': contato.id._serialized, 'nomeCliente': nome, 'telefoneCliente': contato.number, 'gender': gender, 'imgCliente': await client.getProfilePicUrl(rows[i].idInt), 'idl': idl }
                                      await _saveLead(obj, true)
                                  }
                              }

                          }
                          let msg = await _loadChat(e.idInt)
                          let attendant = rows[i].aid != null ? await __getAttendant(rows[i].aid) : null
                          rows[i].unreadCount = msg.unreadCount
                          rows[i].wallet = attendant
                          obj.push({
                              'chat': rows[i],
                              'mensagens': msg.messages
                          })
                          let a = initiated.findIndex((b) => parseInt(b.idTicket) == parseInt(e.id))
                          if (a == -1) {
                              initiated.push({ 'nomeCliente': e.nomeCliente, 'numero': e.idInt, 'etapa': 2, 'tipo': 'atendhumano', 'idSetor': e.idSetor, 'idAtend': e.idAtend, 'idTicket': e.id })
                          }

                      })
                      await Promise.all(promises)
                  }
              }).catch(console.log)
                  .then();
          } else {
              await conn.promise().query('SELECT * FROM tbChats WHERE idBot=' + idBot + ' ORDER BY dataConv DESC').then(([rows, fields]) => {
                  obj = rows
              }).catch(console.log)
                  .then();
          }
          resolve(obj)
      })
  } catch (error) {
      console.log(error)
  }
}
module.exports = _loadChats;
