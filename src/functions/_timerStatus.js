const _getStatus = require('./_getStatus');

var __timerStatus = '';
let sendStatus = [];
var sendStatusTimer = false;

function _timerStatus() {
    sendStatusTimer = true
    __timerStatus = setInterval(() => {
        console.log(sendStatus)
        var idx = sendStatus.findIndex((e) => e.dateOut <= Date.now())
        if (idx != -1) {
            _getStatus(sendStatus[idx].id)
            sendStatus.splice(idx, 1);
            if (sendStatus.length == 0) {
                clearInterval(__timerStatus)
                sendStatusTimer = false
            }
        }
    }, 5000);
}
module.exports = _timerStatus;
