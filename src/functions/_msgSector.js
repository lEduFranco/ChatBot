const _sendImg = require('./_sendImg');

async function _msgSector(name, gender, idInt) {
  var msgInicio = global.config.msgInicio
  msgInicio = msgInicio.replace('%BOTNOME%', global.config.nomeBot)
  if (name != undefined && name != 'undefined') {
      msgInicio = msgInicio.replace('%CLIENTE%', name)
      msgInicio = msgInicio.replace('%AO%', gender == 'male' ? 'o' : 'a')
  } else {
      msgInicio = msgInicio.replace('%CLIENTE%', '')
      msgInicio = msgInicio.replace('%AO%', 'o')
  }
  msgInicio += '\n\n'
  msgInicio += global.sectors.join('\n')
  msgInicio += '\n\n'
  msgInicio += global.config.infoRodape
  if (global.config.urlImgInicio.length > 0) {
      await _sendImg(idInt, msgInicio, global.config.urlMedia + global.config.urlImgInicio)
  } else {
      await cglobal.lient.sendMessage(idInt, msgInicio)
  }
}
module.exports =  _msgSector;
