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
    res.render('entry');
});

router.post('/', (req,res) => {
    const date = req.body.date;
    const moods = [req.body.mood1,req.body.mood2]
    const msg = req.body.msg;
    const weather = req.body.temp;
    const newDay = new Day ({
        date: date,
        moods: moods,
        entry: msg,
        weatherData: weather
    });

    newDay.save(function(err,savedDay,count) {
        console.log(err);
        res.redirect('/all-entries');
    });
});

module.exports = router;



