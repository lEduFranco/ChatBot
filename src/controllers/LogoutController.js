import _checkApiKey from '../functions/_checkApiKey';
import _sendStatus from '../functions/_sendStatus';
import _saveStatistics from '../functions/_saveStatistics';
import _pmRestart from '../functions/_pmRestart';


var started = false
var authenticated = false;


export default class LogoutController {
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
