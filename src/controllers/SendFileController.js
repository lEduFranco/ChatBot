import _checkApiKey from '../functions/_checkApiKey';
import _sendFile from '../functions/_sendFile';


var authenticated = false;
var urlAudio = urlSite + '/media/sended/'


export default class SendFileController {
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
