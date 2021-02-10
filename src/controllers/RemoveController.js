const checkAccess = require ('../functions/checkAccess');
const { exec } = require ('child_process');

module.exports = {
  async create(req, res) {
    try {
        if (checkAccess(parseInt(req.headers.token))) {
            var portBot = req.body.portBot
            console.log(portBot)
            exec('pm2 delete ' + portBot + ' && pm2 save --force', (error, stdout, stderr) => {
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
