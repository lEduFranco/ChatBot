const _checkApiKey = require('../functions/_checkApiKey');
const _initBot = require('../functions/_initBot');
const changeState = require('../functions/changeState');

module.exports = {
  async create (req, res) {
  try {
      var content = req.body;
      var key = req.headers.authorization;
      console.log("INICIALIZADOR: ", key, _checkApiKey(key));
      if (_checkApiKey(key)) {
          if (!started) {
              _initBot()
              changeState(true)
              res.end('ok');
          } else {
              res.sendStatus(404)
          }
      } else {
          res.status(401).json('invalid key')
      }
  } catch (error) {
      console.log(error)
}}}
