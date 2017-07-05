var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cors = require("cors");
var request = require('request');


// Models
var QueryHistory = require("./models/query");
var rawData;

app.set('view engine', 'pug');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors())

var url = process.env.IMGSEARCHDATABASE ||'mongodb://localhost/image_search_fcc';
mongoose.connect(url);


app.get("/", function(req, res){
	res.render("home")
});

app.post("/", function(req, res, next){
	var term = req.body.searchTerm;
	var paginate = req.body.paginate;
	if (paginate == 0){
		paginate = '';
	}
	res.redirect("/api/imagesearch/" + term + "?offset=" + paginate);
});

app.get('/api/recentsearches', function(req, res, next){
	QueryHistory.find({}, function(err, data){
		if(err){
			res.render("error", {error: err, message: "Something Went Wrong"});
		} else {
			var history = [];
			data.forEach(search=> history.push({term: search.term, date: search.date}))
			res.json(history);
		}
	})
});

//process.env.IMG_SRCH_APIKEY
//process.env.IMG_SRCH_CX

app.get("/api/imagesearch/:term*", function(req, res, next){
	var  term = req.params.term;
	var offset = req.query.offset;
	var cx =  process.env.IMG_SRCH_CX;
	var apiKey = process.env.IMG_SRCH_APIKEY;
	if(req.query.offset){
		url = 'https://www.googleapis.com/customsearch/v1?key=' + apiKey + '&cx=' + cx + '&searchType=image' + '&q=' + term + '&start=' + offset;
	} else {
		url = 'https://www.googleapis.com/customsearch/v1?key=' + apiKey + '&cx=' + cx + '&searchType=image' + '&q=' + term;
	}

	var requestObj = {
		uri: url,
		method: 'GET',
		timeout: 8000
	};

	request(requestObj, function(err, response, body){
		if(err){
			throw(err);
		} else {
			var newDate = new Date();
			var date = newDate.toJSON();
			var searchQuery = {
				'term': term,
				'date': date
			}
			QueryHistory.create(searchQuery, function(err, search){
				if(err){
					res.render("error", {error: err, message: "Something Went Wrong"});
				} else {
					console.log("Successfully queired search into QueryHistory")
				}
			});

			var searchResults = [];
			var result = JSON.parse(body);
			var images = result.items;
			images.forEach(img=>{
				var image = {
					"URL": img.link,
					"snippet": img.snippet,
					"thumbnail": img.image.thumbnailLink,
					"context": img.displayLink,
				}
				searchResults.push(image);
			});
			rawData = searchResults
			res.render("images", {images: searchResults, term: term});
		}
		
	});
});

app.get("/api/rawdata", function(req,res,next){
	res.send(rawData)
});


app.listen(process.env.PORT || 3000, process.env.IP, ()=>{
	console.log("Image Search Abstraction Running");
});


