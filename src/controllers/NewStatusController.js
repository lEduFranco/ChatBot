import _checkApiKey from '../functions/checkToken';
import __newStatus from '../functions/__newStatus';

export default class NewStatusController {
  async create (req, res) {
    try {
        var content = req.body;
        var key = req.headers.authorization
        if (_checkApiKey(key)) {
            let response = await __newStatus(content).then((response) => {
                if (response.status) {
                    res.status(201).json(response)
                } else {
                    res.status(400).json(response)
                }
            })
        } else {
            res.status(401).json('invalid key')
        }
    } catch (error) {
        console.log(error)
    }
  }
}
