const express = require('express'),
	router = express.Router(),
	mongoose = require('mongoose'),
    Day = mongoose.model('Day'),
    Calendar = mongoose.model('Calendar')
    User = mongoose.model("User");

const async = require('hbs/lib/async');
const fetch = require('node-fetch');

const isAuthenticated = (req, res, next) => {
    if(!req.user) {
        res.redirect('/'); 
        console.log('redirecting');
    } else {
        next();
    }
}

router.use(isAuthenticated);

router.get('/create', (req, res) => {
    res.render('create-entry');
});

const apiEndpoint = 'https://api.openweathermap.org/data/2.5/weather?q=';
const apiParams = '&APPID=d9d709fd7de9396d57936eacca6122d5&units=imperial';

router.post('/create', async (req,res) => {
    const date = req.body.date;
    const moods = [req.body.mood1,req.body.mood2]
    const msg = req.body.msg;
    const city = req.body.city;
    const countryCode  = req.body.country;

    const apiCallURL = apiEndpoint + city +',' + countryCode + apiParams;

    fetch(apiCallURL)
        .then ((response) => {
            return response.json();
        })
        .then (async (data) => {
            let temp;
            if (data.main === undefined) {
                temp = "no data";
            }
            else {
                temp = data.main.temp + "°F";
            }

            const newDay = await new Day ({
                date: date,
                moods: moods,
                entry: msg,
                temperature: temp
            }).save();

            Calendar.exists({user: req.user._id}, (err, result) => {
                if (!err) {
                    if (!result) {// If calendar doesn't exist
                        console.log(newDay);
                        const newCal = new Calendar ({
                            user: req.user._id,
                        });
                        newCal.save((err,savedCal)=> {
                            if (err) {
                                console.log("err:", err);

                            } else {
                                savedCal.days.push(newDay);
                                savedCal.save((err,savedCal)=>{
                                    if (err) {
                                        console.log(err)
                                    }
                                    else {
                                        res.redirect(`/entry/${date}`);
                                    }
                                });
                            }
                        });
                    } else {
                        Calendar.findOneAndUpdate({user: req.user._id}, {$push: {days: newDay}}, (err, calendar) => {
                            if (err) { console.log(err); }
                            else {
                                console.log(newDay);
                                res.redirect(`/entry/${date}`);
                            }
                        });
                    }
                }
            });
            

        })
        .catch ((err) => {
            console.log(err)
        });
});

router.get('/:slug', (req, res) => {
	const {slug} = req.params;
	Day.findOne({slug}, (err, day) => {
        day.moods = day.moods.join(" and ")
		res.render('entry-slug', {day});
	});
});

module.exports = router;



