const _saveStatistics = require('./_saveStatistics');
const _pmRestart = require('./_pmRestart');
const _saveSession = require('./_saveSession');
const _pmRestartVPS = require('./_pmRestartVPS');
const _leaveList = require('./_leaveList');
const _checkSchedule = require('./_checkSchedule');
const getGender = require('./getGender');
const _msgSector = require('./_msgSector');
const _sendImgs = require('./_sendImgs');
const _saveTicket = require('./_saveTicket');
const closeTicket = require('./closeTicket');
const _saveMedia = require('./_saveMedia');
const setHumanChat = require('./setHumanChat');
const _checkNull = require('./_checkNull');
const _saveLead = require('./_saveLead');
const _sendGetName = require('./_sendGetName');


let info = '';
let config = '';
let leads = '';
let client = [];
let sendList = [];
let initiated = [];
let sectors_ = [];
let answers = [];
let attendants = [];
let capturing = [];
let subsectors_ = [];

let countClick = { 'sectors': [], 'subsectors': [] }

const portBot = process.env.PORTBOT
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  path: '/' + portBot + '/socket.io', cors: {
      origin: '*',
  }
});

var vCardModel = "BEGIN:VCARD\nVERSION:3.0\nN:;%name%;;;\nFN:%name%\nitem1.TEL;waid=%tel%:+%tel%\nitem1.X-ABLabel:Celular\nEND:VCARD";

async function sendBot(message) {
  return new Promise(async (resolve) => {
      try {
          if (info.me._serialized != message.from) {
              if (message.from.split('@')[1] == 'c.us') {
                  client.sendPresenceAvailable()
                  if (message.body === '*#restart#*') {
                      await message.reply('Ok! Estou me reiniciando...')
                      await _saveStatistics().then((e) => {
                          if (e) {
                              _pmRestart()
                          }
                      })
                      return false
                  } else if (message.body === '*#lists#*') {
                      if (sendList.length > 0) {
                          let ab = []
                          for (let a of sendList) {
                              ab.push({ ID: a.id, Horario: new Date(a.dateOut).toLocaleString() })
                          }
                          console.log(ab)
                          await message.reply(JSON.stringify(ab))
                          return false
                      } else {
                          await message.reply('Nenhuma lista agendada')
                          return false
                      }
                  } else if (message.body === '*#newsession#*') {
                      await _saveSession(false, null)
                      await _saveStatistics().then((e) => {
                          if (e) {
                              _pmRestart()
                          }
                      })
                      return false
                  } else if (message.body === '*#restartvps#*') {
                      await message.reply('Ok! Estou me reiniciando a vps...')
                      await _saveStatistics().then((e) => {
                          if (e) {
                              _pmRestartVPS()
                          }
                      })
                      return false
                  } else if (message.body === '*#now#*') {
                      await message.reply(new Date(Date.now()).toLocaleString())
                      return false
                  } else if (message.body === 'contato') {
                      var msg = vCardModel.replace(/%name%/gi, config.namevCard).replace(/%tel%/gi, client.info.wid.user)
                      await client.sendMessage(message.from, msg, { parseVCards: true })
                      return false
                  } else if (message.body.toLowerCase() === 'sair') {
                      var a = await _leaveList(message.from)
                      if (a) {
                          message.reply('Pronto! Você foi *removido* da nossa lista de transmissão. Caso deseje entrar novamente, entre em contato conosco.')
                      }
                      return false
                  }

                  var cSchedule = _checkSchedule();
                  var idx = initiated.findIndex((e) => e.numero == message.from) //busca iniciados
                  if (idx != -1) {
                      let element = initiated[idx];
                      //console.log("element", element);

                      if (message.body === '#') {
                          if (element.etapa < 2 && element.tipo == 'subsetor') {
                              initiated[idx].etapa = 0
                              initiated[idx].tipo = 'setor'
                              var gender = getGender(initiated[idx].nomeCliente)
                              return await _msgSector(initiated[idx].nomeCliente, gender, message.from)
                          }
                      }

                      if (message.body === 'local') {
                          return await message.reply(new Location(config.coordenadas.split(',')[0], config.coordenadas.split(',')[1], config.textoCoordenadas))
                      }

                      if (element.etapa == 0 || element.etapa == 1) {
                          if (element.tipo == 'setor') {
                              let op = sectors_.find(a => a.digito == parseInt(message.body))
                              //console.log("op", op);
                              if (op != undefined) {
                                  countClick.sectors.push(op.id)
                                  initiated[idx].setor = parseInt(message.body)
                                  initiated[idx].idSetor = op.id

                                  let re = await answers.find((e) => e.idSetor == op.id && parseInt(e.idSubSetor) == 0)

                                  if (op.subSetor == '1') { //opção tem subsetor
                                      initiated[idx].tipo = 'subsetor';

                                      var msgSubSetores = subsectors_.filter(e => e.idSetor == op.id).map(e => '*' + e.digito + '* - ' + e.mensagem).join('\n')
                                      msgSubSetores += '\n\n*#* - Voltar para o menu principal';

                                      if (typeof re != "undefined") {
                                          if (re.imgs != null && re.imgs.length > 0) {
                                              var tx = re.texto + '\n\n' + msgSubSetores
                                              await _sendImgs(message.from, tx, re.imgs)
                                          } else {
                                              await client.sendMessage(message.from, re.texto)
                                              await client.sendMessage(message.from, msgSubSetores)
                                          }

                                          initiated[idx].lastAutoMsgError = undefined;
                                      } else {
                                          if (typeof initiated[idx].lastAutoMsgError == "undefined") {
                                              initiated[idx].lastAutoMsgError = true;
                                              //console.log("config.msgErro11", config.msgErro);
                                              await message.reply(config.msgErro);
                                          }
                                      }
                                  } else {
                                      if (op.atendHumano == '0') {
                                          if (re != undefined) {
                                              if (re.imgs != null && re.imgs.length > 0) {
                                                  await _sendImgs(message.from, re.texto, re.imgs)
                                              } else {
                                                  await client.sendMessage(message.from, re.texto)
                                              }
                                              initiated[idx].lastAutoMsgError = undefined;
                                          } else {
                                              if (typeof initiated[idx].lastAutoMsgError == "undefined") {
                                                  initiated[idx].lastAutoMsgError = true;
                                                  //console.log("config.msgErro22", config.msgErro);
                                                  await message.reply(config.msgErro);
                                              }
                                          }
                                      } else {
                                         // console.log("@@@@@@@@@@ cSchedule", cSchedule);
                                          if (cSchedule == 'on') {
                                              initiated[idx].tipo = 'atendhumano'
                                              initiated[idx].etapa = 2
                                              var idInt = message.from
                                              var idSet_ = initiated[idx].idSetor
                                              var name_ = initiated[idx].nomeCliente
                                              var phone = message.from.split('@')[0]
                                              var img = await client.getProfilePicUrl(message.from)
                                              var resposta = re.texto != undefined ? re.texto : ''
                                              resposta += '\n\nDigite *#* para finalizar o atendimento a qualquer momento!'

                                              if (re != undefined) {
                                                  if (re.imgs != null && re.imgs.length > 0) {
                                                      await _sendImg(message.from, resposta, re.imgs)
                                                  } else {
                                                      await client.sendMessage(message.from, resposta)
                                                  }
                                                  initiated[idx].lastAutoMsgError = undefined;
                                              } else {
                                                  if (typeof initiated[idx].lastAutoMsgError == "undefined") {
                                                      initiated[idx].lastAutoMsgError = true;
                                                      //console.log("config.msgErro33", config.msgErro);
                                                      await message.reply(config.msgErro);
                                                  }
                                              }

                                              let obj = {
                                                  'id': idx,
                                                  'nomeCliente': name_,
                                                  'telefoneCliente': phone,
                                                  'idSetor': idSet_,
                                                  'idSubSetor': 0,
                                                  'imgCliente': img,
                                                  'idInt': idInt
                                              }

                                              await _saveTicket(obj)
                                          } else if (cSchedule == 'break') {
                                              await client.sendMessage(message.from, config.msgAusente)
                                          } else {
                                              await client.sendMessage(message.from, config.msgAusente)
                                          }
                                      }
                                  }

                                  initiated[idx].lastAutoMsgError = undefined;
                              } else {
                                  if (message.body != '#') {
                                      if (typeof initiated[idx].lastAutoMsgError == "undefined") {
                                          initiated[idx].lastAutoMsgError = true;
                                          //console.log("config.msgErro44", config.msgErro);
                                          await message.reply(config.msgErro);
                                      }
                                  }
                              }
                          } else if (element.tipo == 'subsetor') {
                              //console.log("subsectors_", subsectors_);
                              //let opx = subsectors_.find(a => a.idSetor == element.idSetor);
                              //console.log("opxxx", opx);

                              let op = subsectors_.find(a => a.digito == parseInt(message.body) && a.idSetor == element.idSetor);
                              console.log("op22", op);

                              if (typeof op != "undefined") {
                                  countClick.subsectors.push(op.id)
                                  initiated[idx].subsetor = parseInt(message.body)
                                  let re = answers.find((e) => e.idSetor == element.idSetor && e.idSubSetor == op.id);
                                  //console.log("re22", re);

                                  if (op.atendHumano == '0') {
                                      if (typeof re != "undefined") {
                                          if (re.imgs != null && re.imgs.length > 0) {
                                              await _sendImgs(message.from, re.texto, re.imgs)
                                          } else {
                                              await client.sendMessage(message.from, re.texto)
                                          }
                                          initiated[idx].lastAutoMsgError = undefined;
                                      } else {
                                          if (typeof initiated[idx].lastAutoMsgError == "undefined") {
                                              initiated[idx].lastAutoMsgError = true;
                                              await message.reply(config.msgErro);
                                          }
                                      }
                                  } else {
                                      //console.log("cSchedule22", cSchedule);
                                      if (cSchedule == 'on') {
                                          initiated[idx].tipo = 'atendhumano'
                                          initiated[idx].etapa = 2
                                          var idInt = message.from
                                          var idSet_ = initiated[idx].idSetor
                                          var name_ = initiated[idx].nomeCliente
                                          var phone = message.from.split('@')[0]
                                          var img = await client.getProfilePicUrl(message.from)
                                          var resposta = typeof re.texto != "undefined" ? re.texto : ''
                                          resposta += '\n\nDigite *#* para finalizar o atendimento a qualquer momento!';

                                          if (typeof re != "undefined") {
                                              if (re.imgs != null && re.imgs.length > 0) {
                                                  await _sendImgs(message.from, resposta, re.imgs)
                                              } else {
                                                  await client.sendMessage(message.from, resposta)
                                              }
                                              initiated[idx].lastAutoMsgError = undefined;
                                          } else {
                                              if (typeof initiated[idx].lastAutoMsgError == "undefined") {
                                                  initiated[idx].lastAutoMsgError = true;
                                                  await message.reply(config.msgErro);
                                              }
                                          }

                                          let obj = {
                                              'id': idx,
                                              'nomeCliente': name_,
                                              'telefoneCliente': phone,
                                              'idSetor': idSet_,
                                              'idSubSetor': element.subsetor,
                                              'imgCliente': img,
                                              'idInt': idInt
                                          }
                                          await _saveTicket(obj)
                                      } else if (cSchedule == 'break') {
                                          await client.sendMessage(message.from, config.msgAusente)
                                      } else {
                                          await client.sendMessage(message.from, config.msgAusente)
                                      }
                                  }

                                  initiated[idx].lastAutoMsgError = undefined;
                              } else {
                                  if (typeof initiated[idx].lastAutoMsgError == "undefined") {
                                      initiated[idx].lastAutoMsgError = true;

                                      //console.log("config.msgErro77", config.msgErro);
                                      await message.reply(config.msgErro);

                                      var msgSubSetores = subsectors_.filter(e => e.idSetor == element.idSetor).map(e => '*' + e.digito + '* - ' + e.mensagem).join('\n')
                                      msgSubSetores += '\n\n*#* - Voltar para o menu principal';

                                      await client.sendMessage(message.from, msgSubSetores)
                                  }
                              }
                          }
                      } else if (element.etapa == 2 && element.tipo == 'atendhumano') {
                          let e = initiated[idx]

                          if (message.body == '#') {
                              if (config.chatbot) {
                                  await closeTicket({ 'idTicket': e.idTicket, 'idx': idx, 'idInt': message.from})
                              }
                          } else {
                              var ab = ''
                              if (message.hasMedia) {
                                  ab = await _saveMedia(message);
                              }

                              let obj = {
                                  'id': message.id.id,
                                  'serialized': message.id._serialized,
                                  'type': message.type,
                                  'ext': ab.ext,
                                  'msg': message.body,
                                  'file': ab.link,
                                  'idTicket': e.idTicket,
                                  'timestamp': message.timestamp,
                                  'hasQuotedMsg': message.hasQuotedMsg,
                                  'quoteMsg': message.hasQuotedMsg ? await message.getQuotedMessage() : []
                              }

                              if (e.idTicket != undefined) {
                                  let ea = attendants.filter((e) => e.idAtendente == initiated[idx].idAtend).map((e) => {
                                      io.of('/' + portBot).to(e.idSocket).emit('recebeCS', obj)
                                  })
                                  if (ea.length == 0) {
                                      io.of('/' + portBot).emit('recebeCS', obj)
                                  }
                              }

                          }
                      } else if (element.etapa == 3 && element.tipo == 'ajuda') { }
                  } else {
                      var idl = leads.findIndex((e) => e.idInt == message.from) //busca na tabela leads
                      var off = await setHumanChat(message, cSchedule, idl)
                      if (off) {
                          return false
                      }
                      if (config.nomeAut) { //nome automatico ligado
                          let contato = await client.getContactById(message.from)
                          var nome = '';
                          if (idl != -1) { //tem na leads
                              if (_checkNull(leads[idl].nomeCliente)) { //tem nome valido
                                  nome = leads[idl].nomeCliente
                                  initiated.push({ 'nomeCliente': nome, 'numero': message.from, 'etapa': 0, 'tipo': 'setor' })
                                  var gender = getGender(nome)
                                  await _msgSector(nome, gender, message.from)
                              } else { //tem nome invalido
                                  var idc = capturing.findIndex((e) => e.numero == message.from)
                                  if (idc != -1) {
                                      if (!/\d/.test(message.body)) {
                                          if (message.body.length >= 3) {
                                              var nome = message.body;
                                              var gender = getGender(nome)
                                              initiated.push({ 'nomeCliente': nome, 'numero': message.from, 'etapa': 0, 'tipo': 'setor' })
                                              await _msgSector(nome, gender, message.from)
                                              let obj = { 'idInt': contato.id._serialized, 'nomeCliente': nome, 'telefoneCliente': contato.number, 'gender': gender, 'imgCliente': await client.getProfilePicUrl(message.from), 'idl': idl }
                                              capturing.splice(idc, 1);
                                              await _saveLead(obj, true)
                                          } else {
                                              await message.reply('Por favor, digite seu nome com mais de 3 letras...🤓')
                                          }
                                      } else {
                                          await message.reply('Por favor, digite somente seu nome sem números...🤓')
                                      }
                                  } else {
                                      if (contato.isBusiness) {
                                          nome = _checkNull(contato.verifiedName) ? contato.verifiedName : ''
                                      } else {
                                          nome = _checkNull(contato.pushname) ? contato.pushname : ''
                                      }
                                      if (!_checkNull(nome)) {
                                          capturing.push({ 'numero': message.from})
                                          await _sendGetName(message.from)
                                      } else {
                                          initiated.push({ 'nomeCliente': nome, 'numero': message.from, 'etapa': 0, 'tipo': 'setor' })
                                          var gender = getGender(nome)
                                          await _msgSector(nome, gender, message.from)
                                          let obj = { 'idInt': contato.id._serialized, 'nomeCliente': nome, 'telefoneCliente': contato.number, 'gender': gender, 'imgCliente': await client.getProfilePicUrl(message.from), 'idl': idl }
                                          await _saveLead(obj, true)
                                      }
                                  }
                              }
                          } else { //nao é lead
                              var idc = capturing.findIndex((e) => e.numero == message.from)
                              if (idc != -1) {
                                  if (!/\d/.test(message.body)) {
                                      if (message.body.length >= 3) {
                                          var nome = message.body;
                                          var gender = getGender(nome)
                                          initiated.push({ 'nomeCliente': nome, 'numero': message.from, 'etapa': 0, 'tipo': 'setor' })
                                          await _msgSector(nome, gender, message.from)
                                          let obj = { 'idInt': contato.id._serialized, 'nomeCliente': nome, 'telefoneCliente': contato.number, 'gender': gender, 'imgCliente': await client.getProfilePicUrl(message.from), 'idl': idl }
                                          capturing.splice(idc, 1);
                                          await _saveLead(obj, false)
                                      } else {
                                          await message.reply('Por favor, digite seu nome com mais de 3 letras...🤓')
                                      }
                                  } else {
                                      await message.reply('Por favor, digite somente seu nome sem números...🤓')
                                  }
                              } else {
                                  if (contato.isBusiness) {
                                      nome = _checkNull(contato.verifiedName) ? contato.verifiedName : ''
                                  } else {
                                      nome = _checkNull(contato.pushname) ? contato.pushname : ''
                                  }
                                  if (!_checkNull(nome)) {
                                      capturing.push({ 'numero': message.from})
                                      await _sendGetName(message.from)
                                  } else {
                                      initiated.push({ 'nomeCliente': nome, 'numero': message.from, 'etapa': 0, 'tipo': 'setor' })
                                      var gender = getGender(nome)
                                      await _msgSector(nome, gender, message.from)
                                      let obj = { 'idInt': contato.id._serialized, 'nomeCliente': nome, 'telefoneCliente': contato.number, 'gender': gender, 'imgCliente': await client.getProfilePicUrl(message.from), 'idl': idl }
                                      await _saveLead(obj, false)
                                  }
                              }
                          }
                      } else {
                          var idc = capturing.findIndex((e) => e.numero == message.from)
                          if (idc != -1) {
                              if (!/\d/.test(message.body)) {
                                  if (message.body.length >= 3) {
                                      let contato = await client.getContactById(message.from)
                                      var nome = message.body;
                                      var gender = getGender(nome)
                                      await _msgSector(nome, gender, message.from)
                                      initiated.push({ 'nomeCliente': nome, 'numero': message.from, 'etapa': 0, 'tipo': 'setor' })
                                      let obj = { 'idInt': contato.id._serialized, 'nomeCliente': nome, 'telefoneCliente': contato.number, 'gender': gender, 'imgCliente': await client.getProfilePicUrl(message.from), 'idl': idl }
                                      capturing.splice(idc, 1);
                                      await _saveLead(obj, false)
                                  } else {
                                      await message.reply('Por favor, digite seu nome com mais de 3 letras...🤓')
                                  }
                              } else {
                                  await message.reply('Por favor, digite somente seu nome sem números...🤓')
                              }
                          } else {
                              if (idl != -1) {
                                  var nome = leads[idl].nomeCliente
                                  if (_checkNull(nome)) {
                                      var gender = getGender(nome)
                                      await _msgSector(nome, gender, message.from)
                                      initiated.push({ 'nomeCliente': nome, 'numero': message.from, 'etapa': 0, 'tipo': 'setor' })
                                  } else {
                                      capturing.push({ 'numero': message.from})
                                      await _sendGetName(message.from)
                                  }
                              } else {
                                  capturing.push({ 'numero': message.from})
                                  await _sendGetName(message.from)
                              }
                          }
                      }
                  }
              }
          }
          resolve(true)
      } catch (error) {
          console.log(error)
          resolve(false)
      }
  })
}
module.exports = sendBot;
