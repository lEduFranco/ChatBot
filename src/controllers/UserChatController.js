const checkToken = require ('../functions/checkToken');
   const _loadChats = require ('../functions/_loadChats');

var authenticated = false;


module.exports = {
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
