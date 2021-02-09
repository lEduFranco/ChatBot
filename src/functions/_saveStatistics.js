import _openCon from './_openCon';

var idBot = 0;

let countClick = { 'sectors': [], 'subsectors': [] }

async function _saveStatistics() {
  try {
      return new Promise(async function name(resolve, reject) {
          const conn = await _openCon()
          if (countClick.sectors.length > 0) {
              function get(arr) {
                  let a = []
                  var prev;
                  arr.sort();
                  for (var i = 0; i < arr.length; i++) {
                      if (arr[i] !== prev) {
                          a.push({ 'id': arr[i], 'clicks': 1 });
                      } else {
                          a[a.length - 1].clicks++;
                      }
                      prev = arr[i];
                  }
                  return a;
              }
              let c_s = get(countClick.sectors);
              let c_ss = get(countClick.subsectors);
              const f = c_s.map(async (element) => {
                  await conn.promise().query('INSERT INTO tbStatistics SET idBot=' + idBot + ', idSector=' + element.id + ', clicks=' + element.clicks + ', date=NOW()').catch(console.log)
              });
              const g = c_ss.map(async (element) => {
                  await conn.promise().query('INSERT INTO tbStatistics SET idBot=' + idBot + ', idSubsector=' + element.id + ', clicks=' + element.clicks + ', date=NOW()').catch(console.log)
              });
              await Promise.all(f, g)
              countClick.sectors = []
              countClick.subsectors = []
              resolve('sucess')
          } else {
              resolve('sucess')
          }
      })
  } catch (error) {
      console.log(error)
  }
}
export default _saveStatistics;
