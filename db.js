const mongoose = require('mongoose'),
	URLSlugs = require('mongoose-url-slugs'),
  passportLocalMongoose = require('passport-local-mongoose');

// * our site requires authentication...
// * so users have a username and password
// * they also have a calendar
const User = new mongoose.Schema({
	// username: provided by authentication plugin
	// password: hash provided by authentication plugin
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
Day.plugin(URLSlugs('name'));

mongoose.model('User', User);
mongoose.model('Calendar', Calendar);
mongoose.model('Day', Day);
mongoose.connect('mongodb://localhost/moodCalendarDB');
