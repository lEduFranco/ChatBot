import _checkApiKey from '../functions/_checkApiKey';
import _sendAudio from '../functions/_sendAudio';

var authenticated = false;

export default class SendAudioController {
  async create (req, res) {
    try {
        var content = req.body;
        content.url = urlAudio + content.url
        var key = req.headers.authorization
        if (_checkApiKey(key)) {
            if (authenticated) {
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