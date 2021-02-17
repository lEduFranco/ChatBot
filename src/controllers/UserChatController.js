const checkToken = require ('../functions/checkToken');
const _loadChats = require ('../functions/_loadChats');


module.exports = {
  async create (req, res) {
    if (global.authenticated) {
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
