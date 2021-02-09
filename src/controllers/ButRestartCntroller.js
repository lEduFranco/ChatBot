import _checkApiKey from  '../functions/_checkApiKey';
import _pmRestart from  '../functions/_pmRestart';

export default class ButRestartController {
  async create (req, res) {
  try {
    var content = req.body;
    var key = req.headers.authorization
    if (_checkApiKey(key)) {
        if (started) {
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
