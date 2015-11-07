var express = require('express');
var app = express();

var request = require('request');
var _ = require('underscore');

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'https://compose.mixmax.com');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');

    next();
});

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

        var bodyObj = JSON.parse(body);

        // check for empty results
        if (bodyObj.error) {
            var noResultsFound = {
                title: 'No results found.'
            };

            res.send([noResultsFound]);
            return;
        }

        var formattedResults = _.map(bodyObj.tracks.items, function(item) {
            var name = item.name;
            var artists = _.map(item.artists, function(a) { return a.name; }).join(', ');
            var uri = item.uri;

            return {
                title: name + ' by ' + artists,
                text: name + ' by ' + artists + ' [' + uri + ']'
            };
        });

        res.send(formattedResults);
    });
});

function searchTracks(trackName, callback) {
    var trackNameForUrl = trackName.replace(' ', '+');
    var url = 'https://api.spotify.com/v1/search?q=' + trackNameForUrl + '&type=track&limit=10';

    request(url, callback);
}

app.get('/resolveTrack', function(req, res, next) {
    var text = req.query.text;
    var trackURI = text.slice(text.lastIndexOf('[') + 1, text.lastIndexOf(']'));
    var html = '<iframe src="https://embed.spotify.com/?uri=' + trackURI + '" width="300" height="380" frameborder="0" allowtransparency="true"></iframe>';

    res.send({body: html});
});

app.listen(process.env.PORT || 3000);
