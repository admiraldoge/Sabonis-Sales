  var express = require('express');
    var app = express();

    // Our first route
    app.get('/', function (req, res) {
        res.send('Hello Dev!');
    });

    // Listen to port 5000
    app.listen(3000, function () {
        console.log('Dev app listening on port 5000!');
    });