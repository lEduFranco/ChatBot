import _checkApiKey from '../functions/_checkApiKey';
import __newchat from '../functions/__newchat';


export default class NewChatController {
  async create (req, res) {
    try {
        var content = req.body;
        var key = req.headers.authorization
        if (_checkApiKey(key)) {
            let a = await __newchat(content)
            res.status(201).json(a)
        } else {
            res.status(401).json('invalid key')
        }
    } catch (error) {
        console.log(error)
    }
  }
}
