var PORT = 5001;
const commander = require('commander');
const express = require('express');
const nocache = require('nocache');
const http = require('http');
const https = require('https');
const cors = require('cors');
const fs = require('fs');
commander
    .version('1.0.0', '-v, --version')
    .usage('-p <value> -s <value>')
    .option('-p, --port <value>', 'port on which to listen. Default to 5001')
    .option('-ssl, --ssl', 'use ssl.')
    .option('-c, --cer <value>', 'certificate of the server.')
    .option('-k, --key <value>', 'secret key of the server.')
    .parse(process.argv);
const options = commander.opts();


var httpsServer;

if (options.ssl) {
const privateKey  = fs.readFileSync(options.cer, 'utf8');
const certificate = fs.readFileSync(options.key, 'utf8');

const credentials = {key: privateKey, cert: certificate};
httpserver = https.createServer(credentials, app);


}
const app = express();
app.use(nocache());
app.use(cors());
if (options.port) PORT= options.port;
// start the express web server listening on PORT
app.listen(PORT, () => {
    console.log('listening on ' + PORT);
});
console.log('web page for tinyurl running');
app.get('/*', async (req, res) => {

    res.send(req.params).status(200);

});

