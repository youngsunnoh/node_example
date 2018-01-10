var express = require('express');
var geoip = require('geoip-lite');
var logger = require('morgan');
var router = express.Router();

router.get('/', function(req, res, next) {
    console.log(logger(":remote-addr"));
    var ip = "1.217.87.172";
    var geo = geoip.lookup(ip);
    console.log(geo);
    console.log(geo.city);
    console.log(req.hostname);
    console.log(req.protocol);
    console.log(req.signedCookies);
    console.log(req.headers['x-forwarded-for']);
    console.log(req.connection.remoteAddress);
    console.log(req.socket.remoteAddress);
    console.log(req.headers['user-agent'])
    res.send(geo);
});

module.exports = router;