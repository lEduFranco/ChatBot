import _openCon from './_openCon';
import _checkLead from './_checkLead';
import _saveLead from './_saveLead';

var idBot = 0;
let client = [];

async function _leaveList(idInt) {
  try {
      return new Promise(async (resolve) => {
          const conn = await _openCon();
          if (await _checkLead(idInt)) {
              await conn.promise().query('UPDATE tbLeads SET acTransmissao=0 WHERE idInt="' + idInt + '" AND idBot=' + idBot + ' LIMIT 1').catch(console.log).then(() => {
                  resolve(true)
              });
          } else {
              let contato = await client.getContactById(idInt)

              let obj = { 'idInt': idInt, 'nomeCliente': '', 'telefoneCliente': contato.number, 'gender': '0', 'imgCliente': '', 'idl': '' }
              await _saveLead(obj, false)
              resolve(true)
          }
      })
  } catch (error) {
      console.log(error)
  }
}
export default _leaveList;
