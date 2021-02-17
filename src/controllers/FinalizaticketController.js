const _checkApiKey =  require('../functions/_checkApiKey');
const _sendImg =  require('../functions/_sendImg');
const _saveMessages =  require('../functions/_saveMessages');

module.exports = {
  async create (req, res) {
    try {
        var content = req.body;
        var key = req.headers.authorization
        if (_checkApiKey(key)) {
            if (global.authenticated) {
                global.initiated.filter((a) => a.numero == content.idInt).forEach((b) => {
                    global.initiated.splice(global.initiated.indexOf(b), 1)
                })
                if (global.config.urlImgFim.length > 0 && global.config.urlImgFim != '') {
                    if (global.config.chatbot) {
                        await _sendImg(content.idInt, global.config.msgFinal, global.config.urlMedia + global.config.urlImgFim)
                    }
                } else {
                    if (global.config.chatbot) {
                        await client.sendMessage(content.idInt, global.config.msgFinal)
                    }
                }
                var dTime = global.cooldowns.findIndex(e => e.idInt == content.idInt);
                if (dTime != -1) {
                    global.cooldowns.splice(global.cooldowns, 1);
                    if (global.cooldowns.length == 0) {
                        console.log('intervalo pausado')
                        clearInterval(_timerOcioso)
                        global.cooldownsRun = false
                    }
                }
                res.status(201).json({ status: true });
                await _saveMessages(content.idInt, content.idTicket)
            } else {
                res.sendStatus(404)
            }
        } else {
            res.status(401).json('invalid key')
        }
    } catch (error) {
        console.log(error)
    }
  }
}
