const _checkApiKey = require ('../functions/_checkApiKey');
const __getUserData = require ('../functions/__getUserData');

module.exports = {
  async create (req, res) {
    try {
        var content = req.body;
        var key = req.headers.authorization
        if (_checkApiKey(key)) {
            let a = await __getUserData({ idInt: content.id })
            res.status(201).json({ data: a })
        } else {
            res.status(401).json('invalid key')
        }
    } catch (error) {
        console.log(error)
    }
  }
}
