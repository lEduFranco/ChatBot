import _checkApiKey from '../functions/_checkApiKey';
import _sendImg from '../functions/_sendImg';
import _saveMessages from '../functions/_saveMessages';

let initiated = [];
let cooldowns = [];
let config = '';
var authenticated = false;
var cooldownsRun = false;

export default class FinalizaticketController {
  async create (req, res) {
    try {
        var content = req.body;
        var key = req.headers.authorization
        if (_checkApiKey(key)) {
            if (authenticated) {
                initiated.filter((a) => a.numero == content.idInt).forEach((b) => {
                    initiated.splice(initiated.indexOf(b), 1)
                })
                if (config.urlImgFim.length > 0 && config.urlImgFim != '') {
                    if (config.chatbot) {
                        await _sendImg(content.idInt, config.msgFinal, config.urlMedia + config.urlImgFim)
                    }
                } else {
                    if (config.chatbot) {
                        await client.sendMessage(content.idInt, config.msgFinal)
                    }
                }
                var dTime = cooldowns.findIndex(e => e.idInt == content.idInt);
                if (dTime != -1) {
                    cooldowns.splice(cooldowns, 1);
                    if (cooldowns.length == 0) {
                        console.log('intervalo pausado')
                        clearInterval(_timerOcioso)
                        cooldownsRun = false
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
