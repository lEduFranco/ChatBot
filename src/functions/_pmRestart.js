import _notifyAdmin from './_notifyAdmin';

function _pmRestart() {
  console.log(new Date(Date.now()).toLocaleTimeString(), ' - reiniciando instancia')
  _notifyAdmin(new Date(Date.now()).toLocaleTimeString() + ' - reiniciando instancia')
  /*
  exec('pm2 restart ' + portBot + '', (error, stdout, stderr) => {
      if (error) {
          console.log(`error: ${error.message}`);
          return
      }

  });
  */
}
export default _pmRestart;
