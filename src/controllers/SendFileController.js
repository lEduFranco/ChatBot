const _checkApiKey = require ('../functions/_checkApiKey');
const _sendFile = require ('../functions/_sendFile');


var authenticated = false;
var urlSite = '';
var urlAudio = urlSite + '/media/sended/'


module.exports = {
  async create (req, res) {
    try {
        var content = req.body;
        var key = req.headers.authorization
        if (_checkApiKey(key)) {
            if (authenticated) {
                var content = req.body;
                let a = await _sendFile(content.idChat, urlAudio + content.url)
                res.status(201).json(a)
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
