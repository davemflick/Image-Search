var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var index = require('./routes/index');
var mongoose = require('mongoose');
var cors = require("cors");



// Models
var QueryHistory = require("./models/query");


app.set('view engine', 'pug');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors())

var url = 'mongodb://localhost/image_search_fcc';
mongoose.connect(process.env.IMAGESEARCHDB_URI || url);


app.get("/", function(req, res){
	res.render("home")
});

// app.post("/", function(req, res, next){
// 	var term = req.body.searchTerm;
// 	var paginate = req.body.paginate;
// 	var date = new Date();
// 	var newSearch = {term: term, date: date};
// 	QueryHistory.create(newSearch, function(err, search){
// 		if(err){
// 			res.render("error", {error: err, message: "Something Went Wrong"});
// 		} else {
// 			res.redirect("/api/recentsearches");
// 		}
// 	});
// });

app.get('/api/recentsearches', function(req, res, next){
	QueryHistory.find({}, function(err, data){
		if(err){
			res.render("error", {error: err, message: "Something Went Wrong"});
		} else {
			data.forEach(search=> res.json({term: search.term, date: search.date}))
		}
	})
});

app.get("/api/imagesearch/:term*", function(req, res, next){
	var  { term } = req.params;
	var { offset } = req.query;

	var data = new QueryHistory({
		term,
		date: new Date()
	});
	data.save(function(err){
		if(err){
			res.send('error', {error: err, message: "Something Went Wrong"});
		}
		res.json(data)
	});
	// res.json({
	// 	term,
	// 	offset
	// })
});


app.listen(process.env.PORT || 3000, process.env.IP, ()=>{
	console.log("Image Search Abstraction Running");
});