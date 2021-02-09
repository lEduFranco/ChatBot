import _openCon from './_openCon';
import _getChatsSaved from './_getChatsSaved';
import _sendLog from './_sendLog';

var idBot = 0;

let client = [];

async function _saveChats(data) {
  try {
      const conn = await _openCon();
      let conversas = await _getChatsSaved()
      const promises = data.map(async (element, idx) => {
          let contato = await client.getContactById(element.id._serialized)
          var tipo = element.id.server == 'broadcast' ? 'transmissao' : (element.id.server == 'c.us' ? 'contato' : 'grupo')
          var nomeContato = contato.name === undefined ? '' : contato.name
          var nomeWhats = contato.pushname
          if (contato.isBusiness) {
              nomeWhats = contato.verifiedName != undefined ? contato.verifiedName : ''
          }
          var salvo = contato.isMyContact ? '1' : '0'
          var result = conversas.findIndex((e) => e.numeroConv.toString() == element.id.user.toString())
          if (result == -1) {
              // nao tem
              var picUser = await client.getProfilePicUrl(element.id._serialized);
              await conn.promise().query('INSERT INTO tbChats SET idBot=' + idBot + ', idInt="' + element.id._serialized + '", tipoConv="' + tipo + '", numeroConv="' + element.id.user + '", nomeConv="' + nomeWhats + '", nomeContato="' + nomeContato + '", dataConv="' + element.timestamp + '", imgConv="' + picUser + '", salvo=' + salvo + '').catch(console.log).then();;
          } else {
              // tem
              var picUser = await client.getProfilePicUrl(element.id._serialized);
              await conn.promise().query('UPDATE tbChats SET idInt="' + element.id._serialized + '", tipoConv="' + tipo + '", numeroConv="' + element.id.user + '", nomeConv="' + nomeWhats + '", nomeContato="' + nomeContato + '", dataConv="' + element.timestamp + '", imgConv="' + picUser + '", salvo=' + salvo + ' WHERE numeroConv="' + element.id.user + '" AND idBot=' + idBot + ' LIMIT 1').catch(console.log).then();
          }
      })
      await Promise.all(promises);
      _sendLog('...prontinho...todas as conversas foram atualizadas e já vou para o meu lugar!')
  } catch (error) {
      console.log(error)
  }
}
export default _saveChats;
