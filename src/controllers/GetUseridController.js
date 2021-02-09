import _checkApiKey from '../functions/_checkApiKey';
import __getUserData from '../functions/__getUserData';



export default class GetUseridController {
  async create (req, res) {
    try {
        var content = req.body;
        var key = req.headers.authorization
        if (_checkApiKey(key)) {
            let a = await __getUserData({ idInt: content.id })
            res.status(201).json({ data: a })
        } else {
            res.status(401).json('invalid key')
        }
    } catch (error) {
        console.log(error)
    }
  }
}
