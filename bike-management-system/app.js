const express = require('express');
const mongoose = require('mongoose')
const cors = require('cors')
const passport = require('passport')
const bodyParser = require('body-parser')

const { jwtStrategy } = require('./src/config/passport');
const { config } = require('./src/config')
const routes = require('./src/routes');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.options('*', cors());

app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

app.set('view engine', 'ejs')

app.use('/api', routes)

mongoose.connect(config.MONGO_URL).then(() => {
  console.info('Connected to MongoDB');
  app.listen(config.PORT, () => {
    console.info(`Listening to port ${config.PORT}`);
  });
});

module.exports = app;
