function _checkActivity(idInt) {
  const horarioAtual = new Date(Date.now());
  horarioAtual.setSeconds(horarioAtual.getSeconds() + (global.config.tempoLimite * 60));
  var lact = global.actives.findIndex((e) => e.idInt == idInt)
  if (lact == -1) {
    global.actives.push({ 'idInt': idInt, 'time': horarioAtual });
  } else {
    global.actives[lact].time = horarioAtual
  }
  if (global.actives.length == 0) {
      // _timerActives()
  }
}
module.exports = _checkActivity;
