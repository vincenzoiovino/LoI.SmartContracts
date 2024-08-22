const PORT = 5001;
const express = require('express');
const app = express();
const nocache = require('nocache');
const cors = require('cors');
app.use(nocache());
app.use(cors());


// start the express web server listening on 81
app.listen(PORT, () => {
    console.log('listening on ' + PORT);
});
console.log('web page for tinyurl running');
app.get('/*', async (req, res) => {

    res.send(req.params).status(200);

});

