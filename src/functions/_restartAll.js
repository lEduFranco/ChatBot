const _initBot = require('./_initBot');
const _saveContacts = require('./_saveContacts');
const _saveChats = require('./_saveChats');

let client = [];

async function _restartAll() {
  await _initBot()
  let chats = await client.getChats();
  await _saveContacts()
  await _saveChats(chats)
}
module.exports = _restartAll;
