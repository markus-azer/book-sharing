const helmet = require('helmet');
const morgan = require('morgan');
const express = require('express');
const mongoose = require('mongoose');
const bluebird = require('bluebird');
const config = require('./config/config');
const responseWrapper = require('./middlewares/responseWrapper');
const { CustomError, notification } = require('./utilities');

// Set Global Promise & empty & CustomError & SendNotifications
global.Promise = bluebird;
global.empty = require('is-empty');
global.CustomError = CustomError;
global.SendNotifications = notification({ notifications: config.notifications });

// Configure mongoose
mongoose.Promise = bluebird;
mongoose.connect(config.MONGODB_URI, {useNewUrlParser: true});
global.models = require('./models')({ elastic: config.ELASTICSEARCH }); // Push Models to global

// Create new express app and get the port
const app = express();
const port = config.PORT;

// Configure the app Middlewares
app.use(helmet.hidePoweredBy({ setTo: 'PHP/5.4.0'}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));

// Import Routes
const userRoute = require('./routes/user');
const spaceRoute = require('./routes/space');
const bookRoute = require('./routes/book');

// Route Middlewares
app.use('/api/user', userRoute);
app.use('/api/space', spaceRoute);
app.use('/api/book', bookRoute);


// The Catch all Not found route
app.all('*', (req, res, next) => next(new CustomError('Not Found', 404)));

// Error handler
app.use(responseWrapper.errorHandler);

// Data handler
app.use(responseWrapper.dataHandler);

// Bind the app to the port
app.listen(port, () => console.log(`Server Up and Running \n=> http://localhost:${config.PORT}`));

module.exports = app;