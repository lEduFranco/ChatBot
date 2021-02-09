async function __rdCreateDeal(data) {
  return new Promise((resolve) => {
      try {
          /*
          var options = {
              'method': 'POST',
              'url': 'https://plugcrm.net/api/v1/deals',
              'headers': {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                  "token": config.rdstation.token,
                  "deal": {
                      "name": config.rdstation.title_deal,
                      "user_id": config.rdstation.id_user,
                      "rating": config.rdstation.rating
                  },
                  "contacts": [{
                      "name": data.name,
                      "phones": [{ "phone": data.phone, "type": "celular" }]
                  }],
                  "organization": { "name": data.name }
              })
          };
          request(options, function (error, response) {
              if (error) throw new Error(error);
              resolve(true)
          });
          */
      } catch (error) {
          console.log(error)
          resolve(false)
      }
  })
}
export default __rdCreateDeal;
