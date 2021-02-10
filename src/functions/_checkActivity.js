let config = '';

let actives = [];

function _checkActivity(idInt) {
  const horarioAtual = new Date(Date.now());
  horarioAtual.setSeconds(horarioAtual.getSeconds() + (config.tempoLimite * 60));
  var lact = actives.findIndex((e) => e.idInt == idInt)
  if (lact == -1) {
      actives.push({ 'idInt': idInt, 'time': horarioAtual });
  } else {
      actives[lact].time = horarioAtual
  }
  if (actives.length == 0) {
      // _timerActives()
  }
}
module.exports = _checkActivity;
