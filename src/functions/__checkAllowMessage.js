
function __checkAllowMessage(idInt) {
  try {
      let a = global.leads.findIndex((e) => e.idInt == idInt)
      if (a != -1) {
          if (global.leads[a].acTransmissao) {
              return true
          } else { return false }
      } else {
          return true
      }
  } catch (error) {
      console.log(error)
  }
}
module.exports = __checkAllowMessage;
