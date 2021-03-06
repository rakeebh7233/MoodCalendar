const express = require('express'),
	router = express.Router(),
	mongoose = require('mongoose'),
  Calendar = mongoose.model('Calendar');

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
  Calendar.findOne({user: req.user._id}, (err, calendar) => {
    if (err) {
      console.log(err);
    }
    else {
      let days;
      if (calendar) {
        days = calendar.days;
      }
      res.render('all-entries', {days});
    }
  });
});

module.exports = router;