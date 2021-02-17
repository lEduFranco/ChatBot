const checkToken = require ('../functions/checkToken');
const _newTicket = require ('../functions/_newTicket');

module.exports = {
  async create (req, res) {
    if (global.authenticated) {
        var content = req.body;
        var authToken = content.token;
        if (checkToken(authToken)) {
            var img = await global.client.getProfilePicUrl(content.idInt)
            var phone = content.idInt.split('@')[0]
            var idx = global.initiated.findIndex((e) => e.numero == content.idInt)
            if (idx == -1) {
                global.initiated.push({ 'nomeCliente': content.nomeCliente, 'numero': content.idInt, 'etapa': 2, 'tipo': 'atendhumano' })
            } else {
                global.initiated[idx].etapa = 2
                global.initiated[idx].tipo = 'atendHumano'
            }
            var idx = global.initiated.findIndex((e) => e.numero == content.idInt)
            let obj = {
                'id': idx,
                'nomeCliente': content.nomeCliente,
                'telefoneCliente': phone,
                'idSetor': '0',
                'idSubSetor': '0',
                'imgCliente': img,
                'idInt': content.idInt,
                'idAtend': content.idAtend
            }
            res.end('sucesso');
            await _newTicket(obj)
        } else {
            res.end(JSON.stringify([]))
        }
    } else {
        res.sendStatus(404)
    }
  }
}
