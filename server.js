require('dotenv').config();

const sassMiddleware = require('./lib/sass-middleware');
const express = require('express');
const morgan = require('morgan');
const cookieSession = require('cookie-session');
const axios = require('axios');
const cors = require('cors');

const PORT = process.env.PORT || 8080;
const app = express();

app.set('view engine', 'ejs');
app.use(express.json());

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],

  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

//  dev - The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(
  '/styles',
  sassMiddleware({
    source: __dirname + '/styles',
    destination: __dirname + '/public/styles',
    isSass: false, // false => scss, true => sass
  })
);
app.use(express.static('public'));
app.use(cors());

const usersRoutes = require('./routes/users');
const resourcesRoutes = require('./routes/resources');
const routes = require('./routes/usermanagement')

app.use('/log', routes);
app.use('/users', usersRoutes);
app.use('/resources', resourcesRoutes);


app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
