import _checkApiKey from '../functions/_checkApiKey';
import __transferChat from '../functions/__transferChat';


export default class TransferChatController {
  async create (req, res) {
    try {
        var content = req.body;
        var key = req.headers.authorization
        if (_checkApiKey(key)) {
            let a = await __transferChat(content)
            res.status(201).json({ status: a ? 'success' : 'error' })
        } else {
            res.status(401).json('invalid key')
        }
    } catch (error) {
        console.log(error)
    }
  }
}
