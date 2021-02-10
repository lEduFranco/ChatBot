let schedules = [];

function _checkSchedule() {
  var options = { weekday: 'long', hour12: false };
  var prnDt = new Date(Date.now()).toLocaleTimeString('en-us', options);
  var day = prnDt.split(' ')[0]
  var hour = prnDt.split(' ')[1].split(':')[0]
  var minutes = prnDt.split(' ')[1].split(':')[1]
  var seconds = prnDt.split(' ')[1].split(':')[2]
  var fullhour = hour == 24 ? `00:${minutes}:${seconds}` : prnDt.split(' ')[1]
  console.log("_checkSchedule", day, schedules);
  let a = schedules[day]

  if (typeof a != "undefined") {
      if (a.hIn != '0') { //aberto do dia
          var hIn = a.hIn + ':00';
          var hOut = a.hOut + ':00';
          var intStart = a.intStart + ':00';
          var intEnd = a.intEnd + ':00';
          if (fullhour < hIn || fullhour > hOut) { //off
              return 'off'
          } else { //on
              if (fullhour < intStart || fullhour > intEnd) { // atendendo
                  return 'on'
              } else { //intervalo
                  return 'break'
              }
          }
      } else {
          return 'off'
      }
  } else {
      return 'on'
  }
}
module.exports = _checkSchedule;
