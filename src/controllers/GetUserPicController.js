import _checkApiKey from '../functions/_checkApiKey';
import __refreshPicUser from '../functions/__refreshPicUser';

let client = [];

export default class GetUserPicController {
  async create (req, res) {
    try {
        var content = req.body;
        var key = req.headers.authorization
        if (_checkApiKey(key)) {
            let a = await client.getProfilePicUrl(content.id)
            let b = await __refreshPicUser({ idInt: content.id, url: a })
            res.status(201).json({ data: a })
        } else {
            res.status(401).json('invalid key')
        }
    } catch (error) {
        console.log(error)
    }
  }
}
