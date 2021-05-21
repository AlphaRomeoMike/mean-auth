const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');
const users = require('./routes/users');

/**
 * @description: Database Connection On Success Call
 */
mongoose.connect(config.database, {useUnifiedTopology: true, useCreateIndex: true, useNewUrlParser: true});
mongoose.connection.on('connected', () =>{
    console.log('Connected to database ' + config.database);
});

/**
 * @description: Database Connection On Faliure Call
 */
mongoose.connection.on('error', (err) =>{
    console.log('Failed to connect to database ' + config.database);
});

const app = express();
const port = 3005;

/**
 * @description: CORS Middleware
 */
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * @description: BodyParser Middleware
 */
app.use(bodyParser.json());
app.use('/users', users);

/**
 * @description: Passport Middleware
 */
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

/**
 * @description: Basic Empty Route
 */
app.get('/', (req, res) => {
    res.send('Invalid');
});

/**
 * @description: Start Server
 */
app.listen(port, () => {
    console.log("Server listening on port " + port);
});
