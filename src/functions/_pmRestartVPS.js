const _notifyAdmin = require('./_notifyAdmin');

function _pmRestartVPS() {
  console.log(new Date(Date.now()).toLocaleTimeString(), ' - reiniciando VPS')
  _notifyAdmin(new Date(Date.now()).toLocaleTimeString() + ' - reiniciando VPS')
  /*
  exec('pm2 save --force && sudo reboot', (error, stdout, stderr) => {
      if (error) {
          console.log(`error: ${error.message}`);
          return
      }
      console.log(stdout)
  });
  */
}
module.exports = _pmRestartVPS;
