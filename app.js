var express = require('express');
var app = express();

app.get('/', function(req, res, next) {
    res.send('MixMax Spotify');
});

app.listen(3000, function() {
    console.log('server running');
});
