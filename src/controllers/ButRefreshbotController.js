import _checkApiKey from '../functions/_checkApiKey';
import _initBot from '../functions/_initBot';
import checkToken from '../functions/checkToken';

export default class ButRefreshbotController {
  async create (req, res) {
    try {
        if (started && authenticated) {
            var content = req.body;
            var authToken = content.token;
            if (checkToken(authToken)) {
                _initBot()
                res.end('ok');
            } else {
                res.sendStatus(404)
            }
        } else {
            res.sendStatus(404)
        }
    } catch (error) {
        console.log(error)
    }
  }};
