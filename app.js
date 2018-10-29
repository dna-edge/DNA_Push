const express = require('express');
const http = require('http');
const https = require('https');
const fs = require('fs');

const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

require('dotenv').config();
global.utils = require('./utils/global');

require('./workers/SpeakerWorker').init();
http.Server(app).listen(process.env.PORT, process.env.HOST, () => {
  console.info('[DNA-PushServer] Listening on port %s at %s', 
  process.env.PORT, process.env.HOST);
});
module.exports = app;