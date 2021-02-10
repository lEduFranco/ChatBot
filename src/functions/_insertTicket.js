const _openCon = require('./_openCon');

var idBot = 0;

let initiated = []

function _insertTicket(data) {
  try {
      return new Promise(async (resolve) => {

          const conn = await _openCon()
          await conn.promise().query('INSERT INTO tbTickets SET idBot=' + idBot + ', idLead=' + data.uid + ', dataInicio=NOW(), idEtapa=0, idStatus=1, idCanal=0, idSetor="' + data.idSetor + '", idSubSetor=0, idAtend="' + data.idAtend + '"').then(async ([result2]) => {
              var idTicket = result2.insertId
              initiated[data.id].idTicket = idTicket
              resolve(idTicket)
          }).catch(console.log);
      })
  } catch (error) {
      console.log(error)
  }
}
module.exports = _insertTicket;
