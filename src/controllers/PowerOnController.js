const checkAccess = require ('../functions/checkAccess');

module.exports = {
  async create(req, res) {
    try {
        console.log('aqui')

        if (checkAccess(parseInt(req.headers.token))) {
            var portBot = req.body.portBot

            exec('export PORTBOT=' + portBot + ' && pm2 start bot.js --name ' + portBot + ' && pm2 save --force', (error, stdout, stderr) => {
                if (error) {
                    console.log(`error: ${error.message}`);
                    return
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                }
            });
            res.end('success')
        } else {
            res.end('erro')
        }

    } catch (error) {
        console.log(error)
    }
  }
}
