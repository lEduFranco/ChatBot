import _checkApiKey from '../functions/checkToken';
import _sendStatus from '../functions/_sendStatus';
import _saveStatistics from '../functions/_saveStatistics';
import _saveSession from '../functions/_saveSession';
import _pmRestart from '../functions/_pmRestart';

var authenticated = false;
var started = false;
let client = [];

export default class ResetBotController {
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
