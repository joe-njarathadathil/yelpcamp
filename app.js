var express 		= require("express"),
	app 				= express(),
	bodyParser 		= require("body-parser"),
	mongoose			= require("mongoose"),
	passport 		= require("passport"),
	LocalStrategy	= require("passport-local"),
	methodOverride = require("method-override"),
	flash				= require("connect-flash"),
	Campground 		= require("./models/campground"),
	Comment 			= require("./models/comment"),
	User 				= require("./models/user"),
	seedDB 			= require("./seeds.js");

//requiring routes
var 	commentRoutes		= require("./routes/comments"),
		campgroundRoutes	= require("./routes/campgrounds"),
		indexRoutes 		= require("./routes/index");

var url = process.env.DATABASEURL  || "mongodb://localhost/yelp_camp_v11"
mongoose.connect(url);

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());

// seedDB(); 


//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret:"When the Pawn Hits the Conflicts He Thinks like a King What He Knows Throws the Blows When He Goes to the Fight and He'll Win the Whole Thing 'fore He Enters the Ring There's No Body to Batter When Your Mind Is Your Might so When You Go Solo, You Hold Your Own Hand and Remember That Depth Is the Greatest of Heights and If You Know Where You Stand, Then You Know Where to Land and If You Fall It Won't Matter, Cuz You'll Know That You're Right",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
})

app.use("/", indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

app.listen(process.env.PORT || 3000, process.env.IP, function(){
	console.log("server has started");
});