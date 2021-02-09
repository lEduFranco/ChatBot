import _initBot from './_initBot';
import _saveContacts from './_saveContacts';
import _saveChats from './_saveChats';

let client = [];

async function _restartAll() {
  await _initBot()
  let chats = await client.getChats();
  await _saveContacts()
  await _saveChats(chats)
}
export default _restartAll;
