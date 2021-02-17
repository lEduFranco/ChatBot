const _checkApiKey = require ('../functions/_checkApiKey');
const _sendAudio = require ('../functions/_sendAudio');

module.exports = {
  async create (req, res) {
    try {
        var content = req.body;
        content.url = global.urlAudio + content.url
        var key = req.headers.authorization
        if (_checkApiKey(key)) {
            if (global.authenticated) {
                var content = req.body;
                res.end(content.url);
                await _sendAudio(content)
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
