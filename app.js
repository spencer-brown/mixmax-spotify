var express = require('express');
var app = express();

var request = require('request');
var _ = require('underscore');

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
        if (bodyObj.tracks.items.length === 0) {
            var noResultsFound = {
                title: 'No results found.'
            };

            res.send([noResultsFound]);
            return;
        }

        var formattedResults = _.map(bodyObj.tracks.items, function(item) {
            var name = item.name;
            var artists = _.map(item.artists, function(a) { return a.name; }).join(', ');

            return {
                title: name + ' by ' + artists,
                text: name
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

app.listen(3000, function() {
    console.log('server running');
});
