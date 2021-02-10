function checkPhone(number) {
  var a = number.replace(/([^\d])+/gim, '')
  let d = ''
  if (a.length === 12 || a.length === 13) {
      d = a
  } else if (a.length === 11 || a.length === 10) {
      d = '55' + a
  } else {
      d = a
  }
  // if (d.length === 13) {
  //     if (d.substr(2, 2) > 19) {
  //         var t = d.substr(0, 4)
  //         var u = d.substr(-8)
  //         d = t + '' + u
  //     } else {
  //         d = a
  //     }
  // }
  // if (d.length === 13) {
  //     if (d.substr(2, 2) > 19) {
  //         var t = d.substr(0, 4)
  //         var u = d.substr(-8)
  //         d = t + '' + u
  //         return d + '@c.us'
  //     } else {
  //         return false
  //     }
  // }
  // return d.substr(0, 4) + '' + d.substr(-8) + '@c.us'
  return d + '@c.us'
}
module.exports = checkPhone;
