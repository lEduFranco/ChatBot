const _initBot = require ('../functions/_initBot');
const checkToken = require ('../functions/checkToken');

module.exports = {
  async create (req, res) {
    try {
        if (global.started && global.authenticated) {
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
