const _checkApiKey  = require ('../functions/_checkApiKey');
const _pmRestart  = require ('../functions/_pmRestart');

module.exports = {
  async create (req, res) {
  try {
    var content = req.body;
    var key = req.headers.authorization
    if (_checkApiKey(key)) {
        if (global.started) {
            _pmRestart()
            res.end('ok');
            return false
        } else {
            res.sendStatus(404)
        }
    } else {
        res.status(401).json('invalid key')
    }
} catch (error) {
    console.log(error)
}}}
