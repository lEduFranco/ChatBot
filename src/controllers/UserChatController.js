import checkToken from '../functions/checkToken';
import _loadChats from '../functions/_loadChats';

var authenticated = false;


export default class UserChatController {
  async create (req, res) {
    if (authenticated) {
        var content = req.body;
        var authToken = content.token;
        if (checkToken(authToken)) {
            let a = await _loadChats(content)
            res.end(JSON.stringify(a));
        } else {
            res.end(JSON.stringify([]))
        }
    }
  }
}
