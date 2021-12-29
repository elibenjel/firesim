const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
const jwt = require('jsonwebtoken');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const app = express();
const config = require('./webpack.config.js');
const compiler = webpack(config);

//app.use(cors);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Tell express to use the webpack-dev-middleware and use the webpack.config.js
// configuration file as a base.
app.use(
  webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
  })
);

app.use(require("webpack-hot-middleware")(compiler, {
  log: false,
  path: `/__webpack_hmr`,
  heartbeat: 10 * 1000,
}));

var accepted_ids = [];
accepted_ids.push({username : 'temp', password : 'temp'});
const body = (st, data, msg) => ({status : st, data : data, message : msg});

app.post('/login', (req, res) => {
  let {username, password} = req.body;
  success = false;
  for(let i=0; i<accepted_ids.length; i++) {
    if(username == accepted_ids[i].username && password == accepted_ids[i].password) {
      success = true;
      break;
    }
  }

  if (success) {
    const token = jwt.sign(
      {userID : null},// also put an object with the userID here and in the body of the res : {userId: user._id}
      'RANDOM_TOKEN_SECRET',
      { expiresIn: '24h' }
    );
    res.send(body(200, {token : token}, ''))
  }
  else res.status(401).send(body(401, null, 'You provided an invalid username or password'));
});

// Serve the files on port 3000.
app.listen(3000, function () {
  console.log('FIRESim server listening on port 3000!\n');
});