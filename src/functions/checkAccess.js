const tokenAccess = 1030;


function checkAccess(token) {
  if (token != '' && token != null) {
      if (tokenAccess === token) {
          return true
      } else {
          return false
      }
  } else {
      return false
  }
}

module.exports = checkAccess;
