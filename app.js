require('./db');
require('./auth');

const passport = require('passport');
const express = require('express');
const path = require('path');

const routes = require('./routes/index');
const entry = require('./routes/entry')
const allEntries = require('./routes/all-entries')

const app = express();
const port = process.env.PORT || 3000

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// enable sessions
const session = require('express-session');
const sessionOptions = {
    secret: 'secret cookie thang (store this elsewhere!)',
    resave: true,
    saveUninitialized: true
};
app.use(session(sessionOptions));

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// passport setup
app.use(passport.initialize());
app.use(passport.session());

// make user data available to all templates
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

app.use('/', routes);
app.use('/entry', entry);
app.use('/all-entries', allEntries);


app.listen(port, console.log(`Server is starting on port ${port}`));
