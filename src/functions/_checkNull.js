function _checkNull(data) {
  if (data != null && data != '' && data != undefined && data.length > 3) {
      return true
  } else {
      return false
  }
}
module.exports = _checkNull;
