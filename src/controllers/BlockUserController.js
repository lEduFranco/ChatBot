import _checkApiKey from '../functions/_checkApiKey';

let client = [];

export default class BlockUserController {
  async create (req, res) {
    try {
        var content = req.body;
        var key = req.headers.authorization
        if (_checkApiKey(key)) {
            let a = await client.getContactById(content.id)
            let b = await a.block(a).then()
            res.status(201).json({ status: b })
        } else {
            res.status(401).json('invalid key')
        }
    } catch (error) {
        console.log(error)
    }
  }
}