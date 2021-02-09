import checkToken from '../functions/checkToken';
import _newTicket from '../functions/_newTicket';


var authenticated = false;
let client = [];
let initiated = [];


export default class NewTicketController {
  async create (req, res) {
    if (authenticated) {
        var content = req.body;
        var authToken = content.token;
        if (checkToken(authToken)) {
            var img = await client.getProfilePicUrl(content.idInt)
            var phone = content.idInt.split('@')[0]
            var idx = initiated.findIndex((e) => e.numero == content.idInt)
            if (idx == -1) {
                initiated.push({ 'nomeCliente': content.nomeCliente, 'numero': content.idInt, 'etapa': 2, 'tipo': 'atendhumano' })
            } else {
                initiated[idx].etapa = 2
                initiated[idx].tipo = 'atendHumano'
            }
            var idx = initiated.findIndex((e) => e.numero == content.idInt)
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
