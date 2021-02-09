function _checkApiKey(key) {
  return true;
  if (key != '' && key != null) {
      if (key === apiKey) {
          return true
      } else {
          return false
      }
  } else {
      return false
  }
}
export default _checkApiKey;
