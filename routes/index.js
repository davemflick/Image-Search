var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');


var url = 'http://localhost:3000/' // Add data base name;
var MongoClient = mongodb.MongoClient; 

router.get('/', function(req, res, next){
	res.render('index', {title: 'Image Search'});
});

module.exports = router; 