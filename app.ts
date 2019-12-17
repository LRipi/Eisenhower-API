process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

import express = require('express');
require('module-alias/register');
import cors = require('cors');
import compression = require('compression');
import helmet = require('helmet');
import path = require('path');
import cookieParser = require('cookie-parser');
import logger = require('morgan');
import rateLimit = require('express-rate-limit');

const app: express.Application = express();

// Define request limiter per user to avoid DOS attack
const limiterOption: rateLimit.Options = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20000 // limit each IP to 100 requests per windowMs
};
const limiter: rateLimit.Instance = new rateLimit(limiterOption);

// Protections against attack
const corsOptions: cors.CorsOptions = {
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "x-access-token"]
};
app.use(cors(corsOptions));
app.use(helmet());
app.use(compression());
app.use(limiter);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

if (process.env.DEBUG === 'true')
    app.use(logger(process.env.NODE_ENV));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Routes declaration
require('./routes/routes')(app);

module.exports = app;
