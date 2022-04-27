const express = require('express'), 
    router = express.Router(),
    passport = require('passport'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Calendar = mongoose.model('Calendar');

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

router.get('/login', (req, res) =>  {
  res.render('login');
});

router.get('/register', (req, res) =>  {
  res.render('register');
});

router.post('/register', (req, res) =>  {
  const {username, password} = req.body;
  User.register({username}, password, (err, user) => {
    if (err) {
      res.render('register',{message:'Your registration information is not valid'});
    } else {
      passport.authenticate('local')(req, res, function() {
        res.redirect('/');
      });
      
    }
  });   
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if(user) {
      req.logIn(user, (err) => {
        res.redirect('/');
      });
    } else {
      res.render('login', {message:'Your login or password is incorrect.'});
    }
  })(req, res, next);
});

router.get('/', (req, res) =>  {
  if (req.user) {
    Calendar.findOne({user: req.user._id}, (err, calendar) => {
      if (err) {
        console.log(err);
      }
      else {
        let days;
        const daysObject = {};
        if (calendar) {
          days = calendar.days;
          days.map((ele) => {
            let colorMood = '';
            if (ele.moods[0]==='happy') { colorMood = "blue"; }
            else if (ele.moods[0]==='sad') { colorMood = "orange"; }
            else if (ele.moods[0]==='angry') { colorMood = "red"; }
            else if (ele.moods[0]==='excited') { colorMood = "pink"; }
  
            daysObject[ele.date] = colorMood;
          })
        }
        res.render('home', daysObject);
      }
    });
  } else {
    res.render('home');
  }
}); 

router.get('/may', (req, res) =>  {
  if (req.user) {
    Calendar.findOne({user: req.user._id}, (err, calendar) => {
      if (err) {
        console.log(err);
      }
      else {
        let days;
        const daysObject = {};
        if (calendar) {
          days = calendar.days;
          days.map((ele) => {
            let colorMood = '';
            if (ele.moods[0]==='happy') { colorMood = "blue"; }
            else if (ele.moods[0]==='sad') { colorMood = "orange"; }
            else if (ele.moods[0]==='angry') { colorMood = "red"; }
            else if (ele.moods[0]==='excited') { colorMood = "pink"; }
  
            daysObject[ele.date] = colorMood;
          })
        }
        res.render('may', daysObject);
      }
    });
  } else {
    res.render('may');
  }
}); 

router.get('/may/entry/:slug', async (req, res) => {
  const slug = req.params.slug;
  const calendar = await Calendar.findOne({user: req.user._id});
  let foundSlug = false;
  console.log("I am here")
  if (calendar) {
      calendar.days.map(day => {
          if (day.date === slug) {
              day.moods = day.moods.join(" and ")
              res.render('entry-slug', {day});
              foundSlug = true;
          }
      });

  } else {
    res.redirect('/');
    foundSlug = true;
  }
  if (!foundSlug) {
    res.redirect('/');
  }
});

module.exports = router;
