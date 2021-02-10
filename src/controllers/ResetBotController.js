const _checkApiKey = require ('../functions/checkToken');
const _sendStatus = require ('../functions/_sendStatus');
const _saveStatistics = require ('../functions/_saveStatistics');
const _saveSession = require ('../functions/_saveSession');
const _pmRestart = require ('../functions/_pmRestart');

var authenticated = false;
var started = false;
let client = [];

module.exports = {
  async create (req, res) {
    try {
        var content = req.body;
        var key = req.headers.authorization
        if (_checkApiKey(key)) {
            if (started && authenticated) {
                res.end('ok')
                _sendStatus('desconectado');
                await changeState(false).then(async (e) => {
                    if (e) {
                        await _saveStatistics().then(async (e) => {
                            if (e) {
                                if (await _saveSession(false, null)) {
                                    await client.logout()
                                    _pmRestart()
                                }

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
