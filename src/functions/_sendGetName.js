let client = [];
let config = '';

async function _sendGetName(number) {
  try {
      await client.sendMessage(number, 'Olá, eu sou o *' + config.nomeBot + '* 🤖 assistente virtual... me diz, qual o seu nome?')
  } catch (error) {
      console.log(error)
  }
}
export default _sendGetName;
