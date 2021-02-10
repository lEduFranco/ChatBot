async function _restartBot() {
  /*
  const conn = await _openCon()
  try {
      const tempo_p = 3600000 * 2 //2 horas
      const tempo_pp = 60000 // 60 segundos
      var interval_p;
      if (authenticated) {
          startInterval()
      }
      async function startInterval() {
          const h = new Date(Date.now());
          console.log(h.toLocaleTimeString(), ' - contagem iniciada')
          console.log(new Date(h.setMilliseconds(tempo_p)).toLocaleTimeString(), ' - final da contagem')
          interval_p = setInterval(async () => {
              var bi = initiated.findIndex((e) => e.tipo == 'atendhumano')
              if (bi != -1 || sendListRun) {
                  clearInterval(interval_p)
                  startExtra()
              } else {
                  await _saveStatistics().then((e) => {
                      if (e) {
                          _pmRestart()
                      }
                  })
              }
          }, tempo_p);
      }
      async function startExtra() {
          console.log(new Date(Date.now()).toLocaleTimeString(), ' - contagem extra iniciada')
          interval_p = setInterval(async () => {
              var bi = initiated.findIndex((e) => e.tipo == 'atendhumano')
              if (bi == -1 && !sendListRun) {
                  await _saveStatistics().then((e) => {
                      if (e) {
                          _pmRestart()
                      }
                  })
              }
          }, tempo_pp);
      }
      await conn.promise().query('SELECT tl.nomeCliente, tl.idInt, tt.idSetor, tt.idAtend, tt.id as idTicket FROM tbTickets tt INNER JOIN tbLeads tl ON tl.id = tt.idLead WHERE tt.idStatus IN (0,1) AND tt.idBot = ' + idBot + '').then(([rows]) => {
          if (rows.length > 0) {
              rows.map((element) => {
                  initiated.push({ 'nomeCliente': element.nomeCliente, 'numero': element.idInt, 'etapa': 2, 'tipo': 'atendhumano', 'idSetor': element.idSetor, 'idAtend': element.idAtend, 'idTicket': element.idTicket })
              })
          }
      }).catch(console.log)
  } catch (error) {
      console.log(error)
  } finally { }
  */
}
module.exports = _restartBot;
