var mongoose = require("mongoose");
//setup schema for our model 
var campgroundSchema = new mongoose.Schema({
	name: String,
	price: String,
	image: String,
	location:String,
	lat: Number,
	lng: Number,
	description: String,
	author:{
		id:{
			type : mongoose.Schema.Types.ObjectId,
			ref : "User"
		},
		username : String
	},
	comments:[
		{
			type: mongoose.Schema.Types.ObjectId,
			ref : "Comment"
		}]
});

//create a model which has this schema as pattern
var Campground = mongoose.model("Campground",campgroundSchema);
module.exports = Campground;