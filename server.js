const express = require('express');
const mongoose = require('mongoose');

const users = require('./route/api/users');
const profile = require('./route/api/profile');
const posts = require('./route/api/posts')

const app = express();

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