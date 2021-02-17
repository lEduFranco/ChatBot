const _checkNull = require('./_checkNull');
const getGender = require('./getGender');
const _checkLead = require('./_checkLead');
const _saveLead = require('./_saveLead');
const _saveTicket = require('./_saveTicket');

async function setHumanChat(data, cSchedule, idLead) {
  if (!global.config.chatbot && parseInt(global.config.receptSector) != 0) {
      if (cSchedule == 'on') {
          let contato = await global.client.getContactById(data.from)
          var img = await global.client.getProfilePicUrl(data.from)
          if (contato.isBusiness) {
              nome = _checkNull(contato.verifiedName) ? contato.verifiedName : ''
          } else {
              nome = _checkNull(contato.pushname) ? contato.pushname : ''
          }
          if (!_checkNull(nome)) {
              nome = ''
          }
          var idInt = data.from
          var phone = data.from.split('@')[0]
          var gender = getGender(nome)
          let obj = { 'idInt': contato.id._serialized, 'nomeCliente': nome, 'telefoneCliente': contato.number, 'gender': gender, 'imgCliente': img, 'idl': idLead }
          if (idLead == -1) {
              if (!await _checkLead(phone)) {
                  await _saveLead(obj, false)
              }
          } else {
              await _saveLead(obj, true)
          }
          global.initiated.push({ 'nomeCliente': nome, 'numero': data.from, 'etapa': 2, 'tipo': 'atendhumano' })
          // var resposta = 'Digite *#* para finalizar o atendimento a qualquer momento!'
          // await client.sendMessage(data.from, resposta)
          var idx = global.initiated.findIndex((e) => e.numero == data.from) //busca iniciados
          let objt = {
              'id': idx,
              'nomeCliente': nome,
              'telefoneCliente': phone,
              'idSetor': global.config.receptSector,
              'idSubSetor': 0,
              'imgCliente': img,
              'idInt': idInt
          }
          await _saveTicket(objt)
          return true
      } else if (cSchedule == 'break') {
          await global.client.sendMessage(data.from, global.config.msgAusente)
          return true
      } else {
          await global.client.sendMessage(data.from, global.config.msgAusente)
          return true
      }
  }
}
module.exports = setHumanChat;
