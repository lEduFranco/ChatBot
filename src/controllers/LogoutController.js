const _checkApiKey = require ('../functions/_checkApiKey');
const _sendStatus = require ('../functions/_sendStatus');
const _saveStatistics = require ('../functions/_saveStatistics');
const _pmRestart = require ('../functions/_pmRestart');

module.exports = {
  async create (req, res) {
    try {
        var content = req.body;
        var key = req.headers.authorization
        if (_checkApiKey(key)) {
            if (global.started && global.authenticated) {
                res.end('ok')
                _sendStatus('desconectado');
                await changeState(false).then(async (e) => {
                    if (e) {
                        await _saveStatistics().then((e) => {
                            if (e) {
                                _pmRestart()
                            }
                        })
                    }
                })
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
