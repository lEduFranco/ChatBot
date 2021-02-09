const fs = require('fs');
const app = require('express')();
const http = require('http').Server(app)
const mysql2 = require('mysql2');
const { getDiffieHellman } = require('crypto');
const { parse } = require('path');
const bodyParser = require('body-parser')
const { v4: uuidv4 } = require('uuid');
var cors = require('cors');
var path = require('path')
const BD_CONNECT_BOT = './connection.json';
let dconn = '';
const { exec } = require('child_process');
const tokenAccess = 1030;
app.use(cors({
    origin: '*'
}))
app.use(bodyParser.json());
if (fs.existsSync(BD_CONNECT_BOT)) {
    fs.readFile(BD_CONNECT_BOT, (err, data) => {
        if (err) throw err;
        dconn = JSON.parse(data)
    })
}

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

function checkAccess(token) {
    if (token != '' && token != null) {
        if (tokenAccess === token) {
            return true
        } else {
            return false
        }
    } else {
        return false
    }
}

app.post('/3000/poweron', async function(req, res) {
    try {
        console.log('aqui')

        if (checkAccess(parseInt(req.headers.token))) {
            var portBot = req.body.portBot

            exec('export PORTBOT=' + portBot + ' && pm2 start 1.js --name ' + portBot + ' && pm2 save --force', (error, stdout, stderr) => {
                if (error) {
                    console.log(`error: ${error.message}`);
                    return
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                }
            });
            res.end('success')
        } else {
            res.end('erro')
        }

    } catch (error) {
        console.log(error)
    }
});

app.post('/3000/remove', async function(req, res) {
    try {
        if (checkAccess(parseInt(req.headers.token))) {
            var portBot = req.body.portBot
            console.log(portBot)
            exec('pm2 delete ' + portBot + ' && pm2 save --force', (error, stdout, stderr) => {
                if (error) {
                    console.log(`error: ${error.message}`);
                    return
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                }
            });
            res.end('success')
        } else {
            res.end('erro')
        }

    } catch (error) {
        console.log(error)
    }
});

http.listen(3000, function() {
    var addr = http.address();
    console.log('Servidor ON em:' + addr.address + ':' + addr.port);
});