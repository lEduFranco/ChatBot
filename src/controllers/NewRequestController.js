import __newRequest from '../functions/__newRequest';

export default class NewRequestController {
  async create (req, res) {
    try {
        var content = req.body;
        content[0].ip = req.headers['x-real-ip']
        let a = await __newRequest(content)
        if (a) {
            res.status(201).json(a)
        } else {
            res.status(404).end('404 Not found')
        }
    } catch (error) {
        console.log(error)
    }
  }
}
