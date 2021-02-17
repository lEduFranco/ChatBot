const closeTicket = require('./closeTicket');

function _timerOcioso() {
    global.__timerOcioso = setInterval(async () => {
      global.cooldownsRun = true
        global.cooldowns.map(async (e, i) => {
            if (e.time < new Date(Date.now())) {
                var n = e.idInt
                var idx = global.initiated.findIndex((e) => e.numero == n)
                if (idx != -1) {
                    let obj = { 'idTicket': global.initiated[idx].idTicket, 'idx': idx, 'idInt': e.idInt }
                    await closeTicket(obj)
                }
                global.cooldowns.splice(i, 1)
                var msgOcioso = global.config.msgOcioso
                msgOcioso = msgOcioso.replace('%TEMPO%', global.config.tempoLimite + ' minutos')
                return await global.client.sendMessage(n, msgOcioso);
            }
        })
        if (global.cooldowns.length == 0) {
            clearInterval(_timerOcioso)
            global.cooldownsRun = false
        }
    }, 5000)
}
module.exports = _timerOcioso;
