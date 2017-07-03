var express = require('express');
var bodyParser = require('body-parser');
var index = require('./routes/index');
var mongoose = require('mongoose');


var app = express();
app.set('view engine', 'pug');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
	res.render("home")
});


app.listen(process.env.PORT || 3000, process.env.IP, ()=>{
	console.log("Image Search Abstraction Running");
});