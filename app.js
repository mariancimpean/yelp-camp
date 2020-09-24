require('dotenv').config();
const express 		= require("express"),
 	app 			= express(),
 	bodyParser 		= require("body-parser"),
 	mongoose 		= require("mongoose"),
	flash			= require("connect-flash"),
	passport		= require("passport"),
	LocalStrategy   = require("passport-local"),
 	Campground 		= require("./models/campground"),
	Comment 		= require("./models/comment"),
	User 			= require("./models/user"),
	methodOverride  = require("method-override"),
	seedDB			= require("./seeds");

const commentRoutes 	= require("./routes/comments"),
	  campgroundRoutes  = require("./routes/campgrounds"),
	  indexRoutes 		= require("./routes/index");	
//connect to an existing db if exist, if not, create a new one
mongoose.connect("mongodb://localhost:27017/yelp_camp",{
	useNewUrlParser: true,
	useUnifiedTopology:true
})
.then(()=> console.log("Connect to DB!"))
.catch(error => console.log(error.message));

//use body-parser npm for receiving data from FORMS
app.use(bodyParser.urlencoded({extended:true})); 
//shortcut for not using .ejs every time
app.set("view engine","ejs");
app.use(express.static(__dirname +"/public"));
app.use(methodOverride("_method"));
app.use(flash());

//seedDB();//seed the DB

//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "This is a secret key !",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//this middleware will be asign to every route
app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");	
	res.locals.success = req.flash("success");
	next();
});

app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);



app.listen(3000,function(){
	console.log("Yelp Camp server has started..");
});