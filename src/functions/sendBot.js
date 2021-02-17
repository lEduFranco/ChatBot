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
          if (global.info.me._serialized != message.from) {
              if (message.from.split('@')[1] == 'c.us') {
                global.client.sendPresenceAvailable()
                  if (message.body === '*#restart#*') {
                      await message.reply('Ok! Estou me reiniciando...')
                      await _saveStatistics().then((e) => {
                          if (e) {
                              _pmRestart()
                          }
                      })
                      return false
                  } else if (message.body === '*#lists#*') {
                      if (global.sendList.length > 0) {
                          let ab = []
                          for (let a of global.sendList) {
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
                      var msg = vCardModel.replace(/%name%/gi, global.config.namevCard).replace(/%tel%/gi, global.client.info.wid.user)
                      await global.client.sendMessage(message.from, msg, { parseVCards: true })
                      return false
                  } else if (message.body.toLowerCase() === 'sair') {
                      var a = await _leaveList(message.from)
                      if (a) {
                          message.reply('Pronto! Você foi *removido* da nossa lista de transmissão. Caso deseje entrar novamente, entre em contato conosco.')
                      }
                      return false
                  }

                  var cSchedule = _checkSchedule();
                  var idx = global.initiated.findIndex((e) => e.numero == message.from) //busca iniciados
                  if (idx != -1) {
                      let element = global.initiated[idx];
                      //console.log("element", element);

                      if (message.body === '#') {
                          if (element.etapa < 2 && element.tipo == 'subsetor') {
                              global.initiated[idx].etapa = 0
                              global.initiated[idx].tipo = 'setor'
                              var gender = getGender(global.initiated[idx].nomeCliente)
                              return await _msgSector(global.initiated[idx].nomeCliente, gender, message.from)
                          }
                      }

                      if (message.body === 'local') {
                          return await message.reply(new Location(global.config.coordenadas.split(',')[0], global.config.coordenadas.split(',')[1], global.config.textoCoordenadas))
                      }

                      if (element.etapa == 0 || element.etapa == 1) {
                          if (element.tipo == 'setor') {
                              let op = global.sectors_.find(a => a.digito == parseInt(message.body))
                              //console.log("op", op);
                              if (op != undefined) {
                                global.countClick.sectors.push(op.id)
                                  global.initiated[idx].setor = parseInt(message.body)
                                  global.initiated[idx].idSetor = op.id

                                  let re = await global.answers.find((e) => e.idSetor == op.id && parseInt(e.idSubSetor) == 0)

                                  if (op.subSetor == '1') { //opção tem subsetor
                                    global.initiated[idx].tipo = 'subsetor';

                                      var msgSubSetores = global.subsectors_.filter(e => e.idSetor == op.id).map(e => '*' + e.digito + '* - ' + e.mensagem).join('\n')
                                      msgSubSetores += '\n\n*#* - Voltar para o menu principal';

                                      if (typeof re != "undefined") {
                                          if (re.imgs != null && re.imgs.length > 0) {
                                              var tx = re.texto + '\n\n' + msgSubSetores
                                              await _sendImgs(message.from, tx, re.imgs)
                                          } else {
                                              await global.client.sendMessage(message.from, re.texto)
                                              await global.client.sendMessage(message.from, msgSubSetores)
                                          }

                                          global.initiated[idx].lastAutoMsgError = undefined;
                                      } else {
                                          if (typeof global.initiated[idx].lastAutoMsgError == "undefined") {
                                            global.initiated[idx].lastAutoMsgError = true;
                                              //console.log("config.msgErro11", config.msgErro);
                                              await message.reply(global.config.msgErro);
                                          }
                                      }
                                  } else {
                                      if (op.atendHumano == '0') {
                                          if (re != undefined) {
                                              if (re.imgs != null && re.imgs.length > 0) {
                                                  await _sendImgs(message.from, re.texto, re.imgs)
                                              } else {
                                                  await global.client.sendMessage(message.from, re.texto)
                                              }
                                              global.initiated[idx].lastAutoMsgError = undefined;
                                          } else {
                                              if (typeof global.initiated[idx].lastAutoMsgError == "undefined") {
                                                global.initiated[idx].lastAutoMsgError = true;
                                                  //console.log("config.msgErro22", config.msgErro);
                                                  await message.reply(global.config.msgErro);
                                              }
                                          }
                                      } else {
                                         // console.log("@@@@@@@@@@ cSchedule", cSchedule);
                                          if (cSchedule == 'on') {
                                              global. initiated[idx].tipo = 'atendhumano'
                                              global.initiated[idx].etapa = 2
                                              var idInt = message.from
                                              var idSet_ = global.initiated[idx].idSetor
                                              var name_ = global.initiated[idx].nomeCliente
                                              var phone = message.from.split('@')[0]
                                              var img = await global.client.getProfilePicUrl(message.from)
                                              var resposta = re.texto != undefined ? re.texto : ''
                                              resposta += '\n\nDigite *#* para finalizar o atendimento a qualquer momento!'

                                              if (re != undefined) {
                                                  if (re.imgs != null && re.imgs.length > 0) {
                                                      await _sendImg(message.from, resposta, re.imgs)
                                                  } else {
                                                      await global.client.sendMessage(message.from, resposta)
                                                  }
                                                  global.initiated[idx].lastAutoMsgError = undefined;
                                              } else {
                                                  if (typeof global.initiated[idx].lastAutoMsgError == "undefined") {
                                                    global.initiated[idx].lastAutoMsgError = true;
                                                      //console.log("config.msgErro33", config.msgErro);
                                                      await message.reply(global.config.msgErro);
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
                                              await global.client.sendMessage(message.from, global.config.msgAusente)
                                          } else {
                                              await global.client.sendMessage(message.from, global.config.msgAusente)
                                          }
                                      }
                                  }

                                  global.initiated[idx].lastAutoMsgError = undefined;
                              } else {
                                  if (message.body != '#') {
                                      if (typeof global.initiated[idx].lastAutoMsgError == "undefined") {
                                        global.initiated[idx].lastAutoMsgError = true;
                                          //console.log("config.msgErro44", config.msgErro);
                                          await message.reply(global.config.msgErro);
                                      }
                                  }
                              }
                          } else if (element.tipo == 'subsetor') {
                              //console.log("subsectors_", subsectors_);
                              //let opx = subsectors_.find(a => a.idSetor == element.idSetor);
                              //console.log("opxxx", opx);

                              let op = global.subsectors_.find(a => a.digito == parseInt(message.body) && a.idSetor == element.idSetor);
                              console.log("op22", op);

                              if (typeof op != "undefined") {
                                global.countClick.subsectors.push(op.id)
                                global.initiated[idx].subsetor = parseInt(message.body)
                                  let re = global.answers.find((e) => e.idSetor == element.idSetor && e.idSubSetor == op.id);
                                  //console.log("re22", re);

                                  if (op.atendHumano == '0') {
                                      if (typeof re != "undefined") {
                                          if (re.imgs != null && re.imgs.length > 0) {
                                              await _sendImgs(message.from, re.texto, re.imgs)
                                          } else {
                                              await global.client.sendMessage(message.from, re.texto)
                                          }
                                          global.initiated[idx].lastAutoMsgError = undefined;
                                      } else {
                                          if (typeof global.initiated[idx].lastAutoMsgError == "undefined") {
                                            global.initiated[idx].lastAutoMsgError = true;
                                              await message.reply(global.config.msgErro);
                                          }
                                      }
                                  } else {
                                      //console.log("cSchedule22", cSchedule);
                                      if (cSchedule == 'on') {
                                          global.initiated[idx].tipo = 'atendhumano'
                                          global.initiated[idx].etapa = 2
                                          var idInt = message.from
                                          var idSet_ = global.initiated[idx].idSetor
                                          var name_ = global.initiated[idx].nomeCliente
                                          var phone = message.from.split('@')[0]
                                          var img = await global.client.getProfilePicUrl(message.from)
                                          var resposta = typeof re.texto != "undefined" ? re.texto : ''
                                          resposta += '\n\nDigite *#* para finalizar o atendimento a qualquer momento!';

                                          if (typeof re != "undefined") {
                                              if (re.imgs != null && re.imgs.length > 0) {
                                                  await _sendImgs(message.from, resposta, re.imgs)
                                              } else {
                                                  await global.client.sendMessage(message.from, resposta)
                                              }
                                              global.initiated[idx].lastAutoMsgError = undefined;
                                          } else {
                                              if (typeof global.initiated[idx].lastAutoMsgError == "undefined") {
                                                global.initiated[idx].lastAutoMsgError = true;
                                                  await message.reply(global.config.msgErro);
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
                                          await global.client.sendMessage(message.from, global.config.msgAusente)
                                      } else {
                                          await global.client.sendMessage(message.from, global.config.msgAusente)
                                      }
                                  }

                                  global.initiated[idx].lastAutoMsgError = undefined;
                              } else {
                                  if (typeof global.initiated[idx].lastAutoMsgError == "undefined") {
                                    global.initiated[idx].lastAutoMsgError = true;

                                      //console.log("config.msgErro77", config.msgErro);
                                      await message.reply(global.config.msgErro);

                                      var msgSubSetores = global.subsectors_.filter(e => e.idSetor == element.idSetor).map(e => '*' + e.digito + '* - ' + e.mensagem).join('\n')
                                      msgSubSetores += '\n\n*#* - Voltar para o menu principal';

                                      await global.client.sendMessage(message.from, msgSubSetores)
                                  }
                              }
                          }
                      } else if (element.etapa == 2 && element.tipo == 'atendhumano') {
                          let e = global.initiated[idx]

                          if (message.body == '#') {
                              if (global.config.chatbot) {
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
                                  let ea = global.attendants.filter((e) => e.idAtendente == global.initiated[idx].idAtend).map((e) => {
                                      io.of('/' + portBot).to(e.idSocket).emit('recebeCS', obj)
                                  })
                                  if (ea.length == 0) {
                                      io.of('/' + portBot).emit('recebeCS', obj)
                                  }
                              }

                          }
                      } else if (element.etapa == 3 && element.tipo == 'ajuda') { }
                  } else {
                      var idl = global.leads.findIndex((e) => e.idInt == message.from) //busca na tabela leads
                      var off = await setHumanChat(message, cSchedule, idl)
                      if (off) {
                          return false
                      }
                      if (global.config.nomeAut) { //nome automatico ligado
                          let contato = await global.client.getContactById(message.from)
                          var nome = '';
                          if (idl != -1) { //tem na leads
                              if (_checkNull(global.leads[idl].nomeCliente)) { //tem nome valido
                                  nome = global.leads[idl].nomeCliente
                                  global.initiated.push({ 'nomeCliente': nome, 'numero': message.from, 'etapa': 0, 'tipo': 'setor' })
                                  var gender = getGender(nome)
                                  await _msgSector(nome, gender, message.from)
                              } else { //tem nome invalido
                                  var idc = global.capturing.findIndex((e) => e.numero == message.from)
                                  if (idc != -1) {
                                      if (!/\d/.test(message.body)) {
                                          if (message.body.length >= 3) {
                                              var nome = message.body;
                                              var gender = getGender(nome)
                                              global.initiated.push({ 'nomeCliente': nome, 'numero': message.from, 'etapa': 0, 'tipo': 'setor' })
                                              await _msgSector(nome, gender, message.from)
                                              let obj = { 'idInt': contato.id._serialized, 'nomeCliente': nome, 'telefoneCliente': contato.number, 'gender': gender, 'imgCliente': await global.client.getProfilePicUrl(message.from), 'idl': idl }
                                              global.capturing.splice(idc, 1);
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
                                        global.capturing.push({ 'numero': message.from})
                                          await _sendGetName(message.from)
                                      } else {
                                          global.initiated.push({ 'nomeCliente': nome, 'numero': message.from, 'etapa': 0, 'tipo': 'setor' })
                                          var gender = getGender(nome)
                                          await _msgSector(nome, gender, message.from)
                                          let obj = { 'idInt': contato.id._serialized, 'nomeCliente': nome, 'telefoneCliente': contato.number, 'gender': gender, 'imgCliente': await global.client.getProfilePicUrl(message.from), 'idl': idl }
                                          await _saveLead(obj, true)
                                      }
                                  }
                              }
                          } else { //nao é lead
                              var idc = global.capturing.findIndex((e) => e.numero == message.from)
                              if (idc != -1) {
                                  if (!/\d/.test(message.body)) {
                                      if (message.body.length >= 3) {
                                          var nome = message.body;
                                          var gender = getGender(nome)
                                          global.initiated.push({ 'nomeCliente': nome, 'numero': message.from, 'etapa': 0, 'tipo': 'setor' })
                                          await _msgSector(nome, gender, message.from)
                                          let obj = { 'idInt': contato.id._serialized, 'nomeCliente': nome, 'telefoneCliente': contato.number, 'gender': gender, 'imgCliente': await global.client.getProfilePicUrl(message.from), 'idl': idl }
                                          global.capturing.splice(idc, 1);
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
                                    global.capturing.push({ 'numero': message.from})
                                      await _sendGetName(message.from)
                                  } else {
                                    global.initiated.push({ 'nomeCliente': nome, 'numero': message.from, 'etapa': 0, 'tipo': 'setor' })
                                      var gender = getGender(nome)
                                      await _msgSector(nome, gender, message.from)
                                      let obj = { 'idInt': contato.id._serialized, 'nomeCliente': nome, 'telefoneCliente': contato.number, 'gender': gender, 'imgCliente': await global.client.getProfilePicUrl(message.from), 'idl': idl }
                                      await _saveLead(obj, false)
                                  }
                              }
                          }
                      } else {
                          var idc = global.capturing.findIndex((e) => e.numero == message.from)
                          if (idc != -1) {
                              if (!/\d/.test(message.body)) {
                                  if (message.body.length >= 3) {
                                      let contato = await global.client.getContactById(message.from)
                                      var nome = message.body;
                                      var gender = getGender(nome)
                                      await _msgSector(nome, gender, message.from)
                                      global.initiated.push({ 'nomeCliente': nome, 'numero': message.from, 'etapa': 0, 'tipo': 'setor' })
                                      let obj = { 'idInt': contato.id._serialized, 'nomeCliente': nome, 'telefoneCliente': contato.number, 'gender': gender, 'imgCliente': await global.client.getProfilePicUrl(message.from), 'idl': idl }
                                      global.capturing.splice(idc, 1);
                                      await _saveLead(obj, false)
                                  } else {
                                      await message.reply('Por favor, digite seu nome com mais de 3 letras...🤓')
                                  }
                              } else {
                                  await message.reply('Por favor, digite somente seu nome sem números...🤓')
                              }
                          } else {
                              if (idl != -1) {
                                  var nome = global.leads[idl].nomeCliente
                                  if (_checkNull(nome)) {
                                      var gender = getGender(nome)
                                      await _msgSector(nome, gender, message.from)
                                      global.initiated.push({ 'nomeCliente': nome, 'numero': message.from, 'etapa': 0, 'tipo': 'setor' })
                                  } else {
                                      global.capturing.push({ 'numero': message.from})
                                      await _sendGetName(message.from)
                                  }
                              } else {
                                  global.capturing.push({ 'numero': message.from})
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
