var mongoose = require("mongoose");

//setup schema for our comments model
var commentSchema = mongoose.Schema(
	{
		text:String,
		author: {
			id: {
				type: mongoose.Schema.Types.ObjectId,
				ref : "User"
			},
			username: String
		}
	});

module.exports = mongoose.model("Comment",commentSchema);