var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User 	 = require("../models/user");


router.get("/",function(req,res){
	res.render("landing");
});

//==================
//AUTH ROUTES
//==================

//SHOW REGISTER FORM
router.get("/register",function(req,res){
	res.render("register");
});

//SIGN UP LOGIC
router.post("/register",function(req,res){
	var newUser = User({username:req.body.username});
	User.register(newUser,req.body.password,function(err,user){
		 if(err){
			 req.flash("error",err.message); 
			 return res.redirect("register");
		 }else{
			passport.authenticate("local")(req,res,function(){
			  req.flash("success","Welcome to YelpCamp, "+user.username); 
			  res.redirect("/campgrounds");
			 });
		 }
			
		
	});
});

//SHOW LOGIN FORM
router.get("/login",function(req,res){
	res.render("login");
});

//LOGIN LOGIC
router.post("/login",function(req,res,next){
	passport.authenticate("local",{
		successRedirect: "/campgrounds",
		failureRedirect: "/login",
		failureFlash:true,
		successFlash : "Welcome to YelpCamp, " + req.body.username +"!"
	})(req,res);
});

//LOG OUT FORM

router.get("/logout",function(req,res){
	req.logout();
	console.log(req.params);
	req.flash("success","Successfully logged out.");
	res.redirect("/campgrounds");
});



module.exports =router;