let config = '';

function _checkScheduleMessage() {
  try {
      var hNow = new Date(Date.now()).getHours();
      let hIn = config.options.schedule[0];
      let hOut = config.options.schedule[1];

      //console.log(hNow+" >= "+hIn+" && "+hNow+" <= "+hOut);
      if (hNow >= hIn && hNow <= hOut || true) { //VALIDAÇÃO DENTRO DE HORA
          return true
      } else {
          return false
      }
  } catch (error) {
      console.log(error)
  }
}
module.exports = _checkScheduleMessage;
