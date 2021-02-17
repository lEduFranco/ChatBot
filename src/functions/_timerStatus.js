const _getStatus = require('./_getStatus');

function _timerStatus() {
    global.sendStatusTimer = true
    global.__timerStatus = setInterval(() => {
        console.log(global.sendStatus)
        var idx = global.sendStatus.findIndex((e) => e.dateOut <= Date.now())
        if (idx != -1) {
            _getStatus(global.sendStatus[idx].id)
            global.sendStatus.splice(idx, 1);
            if (global.sendStatus.length == 0) {
                clearInterval(global.__timerStatus)
                global.sendStatusTimer = false
            }
        }
    }, 5000);
}
module.exports = _timerStatus;
