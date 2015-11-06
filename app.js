var express = require('express');
var app = express();

var request = require('request');

app.get('/', function(req, res, next) {
    res.send('MixMax Spotify');
});

app.get('/searchTracks', function(req, res, next) {
    var trackName = req.query.text;

    searchTracks(trackName, function(error, response, body) {
        if (error) {
            console.log('error searching tracks', error);
            res.sendStatus(500);
        }

        // TODO: Format data
        res.send(response.body);
    });
});

function searchTracks(trackName, callback) {
    var trackNameForUrl = trackName.replace(' ', '+');
    var url = 'https://api.spotify.com/v1/search?q=' + trackNameForUrl + '&type=track&limit=10';

    request(url, callback);
}

app.listen(3000, function() {
    console.log('server running');
});
