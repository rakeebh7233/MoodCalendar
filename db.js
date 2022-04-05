const mongoose = require('mongoose'),
	URLSlugs = require('mongoose-url-slugs'),
  passportLocalMongoose = require('passport-local-mongoose');


// * our site requires authentication...
// * so users have a username and password
// * they also have a calendar
const User = new mongoose.Schema({
	// username: provided by authentication plugin
	username: String,
	// password: hash provided by authentication plugin
	password: String,
  	calendar:  { type: mongoose.Schema.Types.ObjectId, ref: 'Calendar' }
});

// a day in the calendar
// * Each day has an associated date, moods, entry, and weather Data
const Day = new mongoose.Schema({
	date: {type: String, min:8, max:8},
	moods: [{type: String}],
	entry: {type: String},
	weatherData: {type: String} 
});

// Each calender is associated with one user
// Calendars can have as many Days, but wouldn't make sense to have more
// than 365 Days
const Calendar = new mongoose.Schema({
	user: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
	days: [Day]
});

User.plugin(passportLocalMongoose);
Day.plugin(URLSlugs('name')); // check if this works

mongoose.model('User', User);
mongoose.model('Calendar', Calendar);
mongoose.model('Day', Day);

/*
// is the environment variable, NODE_ENV, set to PRODUCTION? 
let dbconf;
if (process.env.NODE_ENV === 'PRODUCTION') {
 // if we're in PRODUCTION mode, then read the configration from a file
 // use blocking file io to do this...
 const fs = require('fs');
 const path = require('path');
 const fn = path.join(__dirname, 'config.json');
 const data = fs.readFileSync(fn);

 // our configuration file will be in json, so parse it and set the
 // conenction string appropriately!
 const conf = JSON.parse(data);
 dbconf = conf.dbconf;
} else {
 // if we're not in PRODUCTION mode, then use
 dbconf = 'mongodb://localhost/moodCalendarDB';
}

mongoose.connect(dbconf);
*/

mongoose.connect("mongodb+srv://rakeeb:mongoDB@mooddb.znyjw.mongodb.net/moodCalendarDB?retryWrites=true&w=majority");

mongoose.connection.on('connected', () => {
	//console.log("Mongoose is connnected to ", dbconf);
	console.log("Mongoose is connnected!");

});