const _getList = require('./_getList');

function _timerLists() {
  global.sendListTimer = true
    console.log('listas', global.sendList)
    global.__timerLists = setInterval(() => {
        var idx = global.sendList.findIndex((e) => e.dateOut <= Date.now())
        if (idx != -1) {
            if (!global.sendListRun) {
                stopTransmission = false
                _getList(global.sendList[idx].id)
                global.sendList.splice(idx, 1);
                if (global.sendList.length == 0) {
                    clearInterval(global.__timerLists)
                    global.sendListTimer = false
                }
            }
        }
    }, 5000);
}
module.exports = _timerLists;
