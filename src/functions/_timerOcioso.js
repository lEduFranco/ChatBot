const closeTicket = require('./closeTicket');

var __timerOcioso = '';
var cooldownsRun = false;

let cooldowns = [];
let client = [];
let initiated = [];
let config = '';

function _timerOcioso() {
    __timerOcioso = setInterval(async () => {
        cooldownsRun = true
        cooldowns.map(async (e, i) => {
            if (e.time < new Date(Date.now())) {
                var n = e.idInt
                var idx = initiated.findIndex((e) => e.numero == n)
                if (idx != -1) {
                    let obj = { 'idTicket': initiated[idx].idTicket, 'idx': idx, 'idInt': e.idInt }
                    await closeTicket(obj)
                }
                cooldowns.splice(i, 1)
                var msgOcioso = config.msgOcioso
                msgOcioso = msgOcioso.replace('%TEMPO%', config.tempoLimite + ' minutos')
                return await client.sendMessage(n, msgOcioso);
            }
        })
        if (cooldowns.length == 0) {
            clearInterval(_timerOcioso)
            cooldownsRun = false
        }
    }, 5000)
}
module.exports = _timerOcioso;
