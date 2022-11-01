
const http = require('http');
const express = require("express");
const logger = require('morgan');
const helmet = require("helmet");
const cors = require("cors");

const mongoose = require('mongoose');

const { Schema } = mongoose;

const tokenSchema = new Schema({
	address: { type: String, required:true, index: true },
	logoURI:  {type:String, required:true},
	decimals: {type: Number, required:true}, // String is shorthand for {type: String}
	name: {type: String, required:true},
	symbol: {type: String, required:true},
});

const Token = mongoose.model('Token', tokenSchema);

require('dotenv').config()

const app = express();

app.use(helmet.hidePoweredBy());
app.use(cors({origin:true}))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));



app.get("/",async (req, res)=>{
	return res.send(await Token.find({},{_id:0,__v:0}));
});

app.post("/",async (req, res, next)=>{
	//console.log(req.body);
	const {address, name,symbol,decimals,logoURI} = req.body;
	try{
		const tk = Token({address, name,symbol,decimals,logoURI});
		await tk.save();
		return res.send(tk);
	}catch(e){
		return next(e);
	}
});

// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  return res.send({error:true, msg:err.message});
});

const server = http.createServer(app);

async function main(){
	const [db] = await Promise.all([mongoose.connect(process.env.DATABASE_URI), server.listen(process.env.PORT)])
	console.log(`Connected to ${db.connection.name} Database`)
	console.log(`App served as port ${process.env.PORT}`)
}

main();
