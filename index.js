const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const DB = require('./database.js');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// serve static files from the public folder
app.use(express.static('public'));

// handle POST requests to the login form
app.post('/login', function(req, res) {
  const username = req.body.username;
  const password = req.body.password;

  // check credentials (replace this with your own logic)
  const isAuthenticated = checkCredentials(username, password);

  if (isAuthenticated) {
    res.send(`Welcome, ${username}!`);
  } else {
    res.status(401).send('Invalid credentials');
  }
});

function checkCredentials(username, password) {
  // replace this with your own logic for checking credentials
  return username === 'user' && password === 'password';
}

app.listen(4000, function() {
  console.log('Server listening on http://localhost:3000');
});