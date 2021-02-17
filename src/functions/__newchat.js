const __getValidPhone = require ('./__getValidPhone');
const checkPhone = require ('./checkPhone');
const _checkNull = require ('./_checkNull');
const getGender = require ('./getGender');
const _saveLead = require ('./_saveLead');
const __checkticketOn = require ('./__checkticketOn');
const _insertTicket = require ('./_insertTicket');

async function __newchat(data) {
  try {
      return new Promise(async (resolve) => {
          try {
              var phone = await __getValidPhone(checkPhone(data.phone))
              console.log('__newchat as ' + new Date().toLocaleString(), phone)
              if (await global.client.isRegisteredUser(phone)) {
                  var img = await global.client.getProfilePicUrl(phone)
                  let a = global.leads.findIndex((e) => e.idInt == phone)
                  var name = () => {
                      if (a != -1) {
                          return _checkNull(global.leads[a].nomeCliente) ? global.leads[a].nomeCliente : ''
                      } else {
                          return ''
                      }
                  }


                  var gender = getGender(name())
                  let obj = { 'idInt': phone, 'nomeCliente': name(), 'telefoneCliente': phone.split('@')[0], 'gender': gender, 'imgCliente': img, 'idl': null }
                  var uid = a != -1 ? global.leads[a] : await _saveLead(obj, false)
                  if (!await __checkticketOn(uid.id)) {
                    global.initiated.push({ 'nomeCliente': name(), 'numero': phone, 'etapa': 2, 'tipo': 'atendhumano', idAtend: data.idAtend })
                      var idx = global.initiated.findIndex((e) => e.numero == phone)
                      if (idx != -1) {
                          let b = await _insertTicket({ uid: uid.id, idSetor: data.idSetor, idAtend: data.idAtend, id: idx })
                          resolve({ status: true, idTicket: b, name: name(), img: img, idInt: phone })
                      } else {
                          resolve({ status: false, idTicket: null, response: 'erro' })
                      }
                  } else {
                      resolve({ status: false, idTicket: null, response: 'O usuário já está em atendimento.' })
                  }

              } else {
                  resolve({ status: false, idTicket: null, response: 'Usuário não possui WhatsApp registrado.' })
              }
          } catch (error) {
              resolve({ status: false, idTicket: null, response: 'erro' })
          }
      })
  } catch (error) {
      console.log(error)
  }
}
module.exports = __newchat;
