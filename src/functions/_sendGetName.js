async function _sendGetName(number) {
  try {
      await global.client.sendMessage(number, 'Olá, eu sou o *' + global.config.nomeBot + '* 🤖 assistente virtual... me diz, qual o seu nome?')
  } catch (error) {
      console.log(error)
  }
}
module.exports = _sendGetName;
