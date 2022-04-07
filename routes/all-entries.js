const express = require('express'),
	router = express.Router(),
	mongoose = require('mongoose');
    Day = mongoose.model('Day');

const isAuthenticated = (req, res, next) => {
  if(!req.user) {
    res.redirect('/'); 
    console.log('redirecting');
  } else {
    next();
  }
}

router.use(isAuthenticated);

router.get('/', (req, res) => {
	Day.find({}, (err, days) => {
		res.render('all-entries', {days});
	});
});

module.exports = router;