var express = require('express');
var app = express();
require('dotenv').config();
var path = require('path');
var mongo = require('./mongo');
var imageSearch = require('node-google-image-search');

app.use(express.static(path.join(__dirname, 'static')));

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/imagesearch', function(req, res){
    var q = req.query['q'];
    var page = (req.query['page'] == '' ? 0: req.query['page']);
    if (isNaN(parseInt(page,10))) {
        res.sendFile(path.join(__dirname, 'badsearch.html'));
    }
    else
    {
        mongo.insertSearch(q, new Date());
        imageSearch(q, parseData, page, 5);
    }

    function parseData(results){
        var result = [];
        results.forEach(function(item){
            var curr = {};
            curr.url=item.link;
            curr.snippet=item.snippet;
            curr.thumbnail=item.image.thumbnailLink;
            curr.context=item.image.contextLink;
            result.push(curr);
        });
        res.send(result);
    }
});

app.get('/latest/imagesearch/', function(req, res){
    mongo.getSearches(function(result){
        res.send(result);
    });
});

app.listen(process.env.PORT || 8080);