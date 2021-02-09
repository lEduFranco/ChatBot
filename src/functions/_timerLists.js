import _getList from './_getList';

var __timerLists = '';
let sendList = [];

var sendListTimer = false;
var stopTransmission = false;
var sendListRun = false;

function _timerLists() {
    sendListTimer = true
    console.log('listas', sendList)
    __timerLists = setInterval(() => {
        var idx = sendList.findIndex((e) => e.dateOut <= Date.now())
        if (idx != -1) {
            if (!sendListRun) {
                stopTransmission = false
                _getList(sendList[idx].id)
                sendList.splice(idx, 1);
                if (sendList.length == 0) {
                    clearInterval(__timerLists)
                    sendListTimer = false
                }
            }
        }
    }, 5000);
}
export default _timerLists;
