let leads = ''
function __checkAllowMessage(idInt) {
  try {
      let a = leads.findIndex((e) => e.idInt == idInt)
      if (a != -1) {
          if (leads[a].acTransmissao) {
              return true
          } else { return false }
      } else {
          return true
      }
  } catch (error) {
      console.log(error)
  }
}
export default __checkAllowMessage;
