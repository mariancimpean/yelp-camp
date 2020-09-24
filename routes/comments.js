//==================
//COMMENTS ROUTES
//==================
var express = require("express");
var router  = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment    = require("../models/comment");
var middleware = require("../middleware")


//NEW ROUTE
router.get("/new",middleware.isLoggedIn,function(req,res){
	//Find campground by ID
	Campground.findById(req.params.id,function(err,campground){
		err ? console.log(err) : res.render("comments/new",{campground:campground});
	});
});
//CREATE ROUTE
router.post("/",middleware.isLoggedIn,function(req,res){
	//lookup campground using ID
	Campground.findById(req.params.id,function(err,campground){
		if(err){
			console.log(err);
			res.redirect("/campground");
		}else{
			Comment.create(req.body.comment,function(err,comment){
				if(err){
					console.log(err);
				}else{
					//add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					//save comment
					comment.save();
					campground.comments.push(comment);
					campground.save();
					req.flash("success","Successfully added comment.");
					res.redirect('/campgrounds/' +campground._id);
				}
			});
		}
	});
});

//EDIT COMMENT 

router.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
	Campground.findById(req.params.id,function(err,foundCampground){
		if(err || !foundCampground){
			req.flash("error","Campground not found!");
			res.redirect("back");
		}else{
			Comment.findById(req.params.comment_id,function(err,comment){
			if(err || !comment){
				req.flash("error","Comment not found!");
				res.redirect("back");
			}else{
				res.render("comments/edit",{campground_id:req.params.id, comment:comment});
			}
		});
		}
	})
	
});

//UPDATE COMMENT

router.put("/:comment_id/",middleware.checkCommentOwnership,function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,comment){
		if(err){
			res.redirect("back");
		}else{
			req.flash("success","Comment successfully updated.")
			res.redirect("/campgrounds/"+ req.params.id);
		}
	});
});

//DELETE COMMENT

router.delete("/:comment_id",middleware.checkCommentOwnership,function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id,function(err){
		if(err){
			res.redirect("back");
		}else{
			req.flash("success","Comment deleted");
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
}); 





module.exports =router;