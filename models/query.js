var mongoose = require("mongoose");

var queryHistory = new mongoose.Schema(
{
	term: String,
	date: Date
},
{timestamps: true}

);

module.exports = mongoose.model("QueryHistory", queryHistory);