const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const users = require('./route/api/users');
const profile = require('./route/api/profile');
const posts = require('./route/api/posts')

const app = express();

//bodyParser middleware
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json())

// Passport middleware
app.use(passport.initialize())

// Passport config
require('./config/passport')(passport)


//DB Config
const db = require('./config/keys').mongoURI;

// Connect to mongoDB
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("Connected to mongoDB"))
  .catch((err) => console.log(err));

app.get('/', (req,res) => {res.send('Hello World')})

// Use Routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

const port = process.env.PORT || 5000;

app.listen(port, ()=> console.log(`Server running on port ${port}`))