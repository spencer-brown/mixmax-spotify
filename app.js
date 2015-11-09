var express = require('express');
var app = express();

var request = require('request');
var _ = require('underscore');
var jade = require('jade');

// compiled on startup so that it can be reused
var render = jade.compileFile('views/trackPreview.jade');

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'https://compose.mixmax.com');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');

    next();
});

app.get('/searchTracks', function(req, res, next) {
    var trackName = req.query.text;

    searchTracks(trackName, function(error, response, body) {
        if (error) {
            console.log('error searching tracks', error);
            res.sendStatus(500);
            return;
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
            var externalURL = item.external_urls.spotify;
            var albumImage = item.album.images[2].url;

            return {
                title: name + ' by ' + artists,
                text: name + ' by ' + artists + '|' + externalURL + '|' + albumImage
            };
        });

        res.send(formattedResults);
    });
});

function searchTracks(trackName, callback) {
    var trackNameForUrl = trackName.trim().replace(' ', '+');
    var url = 'https://api.spotify.com/v1/search?q=' + trackNameForUrl + '&type=track&limit=10';

    request(url, callback);
}

app.get('/resolveTrack', function(req, res, next) {
    var textArr = req.query.text.split('|');

    var html = render({
        trackTitle: textArr[0],
        externalURL: textArr[1],
        albumImage: textArr[2]
    });

    res.send({body: html});
});

app.listen(process.env.PORT || 3000);
