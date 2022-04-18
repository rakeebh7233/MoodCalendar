const mongoose = require('mongoose'),
	URLSlugs = require('mongoose-url-slugs'),
  passportLocalMongoose = require('passport-local-mongoose');

  const uri = process.env.MONGODB_URI;

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
	date: {type: String},
	moods: [{type: String}],
	entry: {type: String},
	weatherData: {type: String}
}, {
    _id: true
});

// Each calender is associated with one user
// Calendars can have as many Days, but wouldn't make sense to have more
// than 365 Days
const Calendar = new mongoose.Schema({
	user: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
	days: [Day]
});

User.plugin(passportLocalMongoose);
Day.plugin(URLSlugs('date')); // check if this works

mongoose.model('User', User);
mongoose.model('Calendar', Calendar);
mongoose.model('Day', Day);

mongoose.connect(uri || "mongodb://localhost/moodCalendarDB");

mongoose.connection.on('connected', () => {
	console.log("Mongoose is connnected!");
});