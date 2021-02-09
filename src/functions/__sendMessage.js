import checkPhone from './checkPhone';
import __scheduleMessage from './__scheduleMessage';

var authenticated = false;

let client = [];

async function __sendMessage(data) {
  return new Promise(async (resolve) => {
      try {
          if ("message" in data && "phone" in data) {
              let phone = checkPhone(data.phone)
              if (authenticated) {
                  await client.sendMessage(phone, data.message).then(() => {
                      resolve({ status: 1, description: 'sended' })
                  }).catch(() => {
                      resolve({ status: 0, description: 'error' })
                  })
              } else {
                  if (__scheduleMessage({ message: data.message, phone: phone })) {
                      resolve({ status: 1, description: 'scheduled' })
                  } else {
                      resolve({ status: 0, description: 'error' })
                  }
              }
          }
      } catch (error) {
          console.log(error)
      }
  })
}
export default __sendMessage;
