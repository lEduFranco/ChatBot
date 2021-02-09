import checkAccess from '../functions/checkAccess';

import { exec } from 'child_process';

export default class RomoveController {
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
