
var http = require('http');
// const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
// const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require("helmet");
const cors = require('cors');
const passport = require("passport");
const registerRoute = require('./routes');
const {connectDB} = require('./model');
const {registerAuth} = require('./util/auth');

require('dotenv').config()

const app = express();

app.use(helmet.hidePoweredBy());
app.use(cors({origin:true}))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  cookieName:'_56unkown__',
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  //cookie: { secure: true }
}));

app.use(passport.initialize())
app.use(passport.session())

registerAuth(passport);
registerRoute(app, '/api/chat');

const server = http.createServer(app);

async function main(){
	const [db] = await Promise.all([connectDB(process.env.DATABASE_URI), server.listen(process.env.PORT)])
	console.log(`Connected to ${db.connection.name} Database`)
	console.log(`App served as port ${process.env.PORT}`)
}

main();

