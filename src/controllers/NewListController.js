import _checkApiKey from '../functions/checkToken';
import __newList from '../functions/__newList';


export default class NewListController {
  async create (req, res) {
    try {
        var content = req.body;
        var key = req.headers.authorization
        if (_checkApiKey(key)) {
            let response = await __newList(content).then((response) => {
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
