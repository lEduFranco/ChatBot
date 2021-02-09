function delay(t) {
  return new Promise(function (resolve, reject) {
      setTimeout(function () { resolve(); }, t * 1000);
  });

  /*
    return new Promise(
        resolve => setTimeout(resolve, t)
    );
    */
}
export default delay;
