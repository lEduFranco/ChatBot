const routes = require ('./routes/routes');

const app = require('express')();
const http = require('http').Server(app)
const bodyParser = require('body-parser')
var cors = require('cors');

const BD_CONNECT_BOT = './connection.json';
const fs = require('fs');

if (fs.existsSync(BD_CONNECT_BOT)) {
  fs.readFile(BD_CONNECT_BOT, (err, data) => {
      if (err) throw err;
      dconn = JSON.parse(data)
  })
}


app.use(cors({
    origin: '*'
}))
app.use(bodyParser.json());

app.use(express.json());
app.use(routes);


async function _openCon() {
    const conn = mysql2.createPool({
        connectionLimit: 10, // default = 10
        host: dconn.host,
        user: dconn.user,
        password: dconn.pass,
        database: dconn.db,
    });
    return conn;
}

async function _getPort() {
    const conn = await _openCon();
    await conn.promise().query('SELECT * FROM tbStores WHERE status=1 ORDER BY id DESC LIMIT 1').then(([rows, fields]) => {
        console.log('valor', rows[0].port)
        return rows[0].port
    }).catch(console.log).then(function(d) {
        console.log(d)
        return d
    })
}


http.listen(3000, function() {
    var addr = http.address();
    console.log('Servidor ON em:' + addr.address + ':' + addr.port);
});
