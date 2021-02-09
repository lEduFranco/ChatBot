import _sendImg from './_sendImg;'

let config = '';
let sectors = []
let client = [];

async function _msgSector(name, gender, idInt) {
  var msgInicio = config.msgInicio
  msgInicio = msgInicio.replace('%BOTNOME%', config.nomeBot)
  if (name != undefined && name != 'undefined') {
      msgInicio = msgInicio.replace('%CLIENTE%', name)
      msgInicio = msgInicio.replace('%AO%', gender == 'male' ? 'o' : 'a')
  } else {
      msgInicio = msgInicio.replace('%CLIENTE%', '')
      msgInicio = msgInicio.replace('%AO%', 'o')
  }
  msgInicio += '\n\n'
  msgInicio += sectors.join('\n')
  msgInicio += '\n\n'
  msgInicio += config.infoRodape
  if (config.urlImgInicio.length > 0) {
      await _sendImg(idInt, msgInicio, config.urlMedia + config.urlImgInicio)
  } else {
      await client.sendMessage(idInt, msgInicio)
  }
}
export default  _msgSector;
