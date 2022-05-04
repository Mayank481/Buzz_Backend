const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const cors = require('cors');
const { CLIENT_URL, PORT, MONGO_URI, cookie } = require('./config');
const passport = require('passport');

const app = express();

// middleware
app.use(
  cors({
    origin: CLIENT_URL,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  })
);

app.set('trust proxy', 1);
app.use(cookieSession(cookie));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', require('./routes/index'));

mongoose.connect(MONGO_URI, (err) => {
  !err && console.log('connected to database');
  err && console.log(err.message);
});

app.listen(PORT, () => console.log('Server running at port', PORT));
