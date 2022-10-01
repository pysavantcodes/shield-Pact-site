const express = require('express');
const {Account, Message} = require('../model');
const {authRequired, verifyAuth} = require('../util/auth');
const {paginate} = require('../util/helper');

const router = express.Router();

router.get('/paginate-message', authRequired, async (req, res)=>{
	let {to, beginTime, ...args} = req.query;
	beginTime = Date.parse(beginTime)||0;
	let filter = {from:{$in:[req.userId, to]}, to:{$in:[req.user.userId, to]}};
	let docLent = await Message.countDocuments(filter);
	let dataFunc = (_skip, _limit)=> Message.find({...filter, timestamp:{$gte:beginTime}},{_id:0}).skip(_skip).limit(_limit);
	let result = await paginate(args, docLent, dataFunc)
	return res.json(result);
});

router.get('/all-message',authRequired, async (req, res)=>{
	let {beginTime, ...args} = req.query;
	beginTime = Date.parse(beginTime)||0;
	let filter = {$or:[{from:req.user.userId},{to:req.user.userId}]};
	let docLent = await Message.countDocuments(filter);
	console.log(docLent, req.user)
	let dataFunc = (_skip, _limit)=> Message.find({...filter, timestamp:{$gte:beginTime}},{_id:0}).skip(_skip).limit(_limit);;
	let result = await paginate(args, docLent, dataFunc)
	return res.json(result);
});

router.post('/send-message', authRequired, async(req, res)=>{
	let {to, body} = req.body;

	let toUser = await Account.findOne({userId: to});
	
	if(!toUser){
		res.status(401)
		return res.json({error:false, msg:"Account Not Exist"})
	}

	if(!toUser.friends.includes(req.user.userId)){
		res.status(401)
		return res.json({error:true, msg:"Not Friends"})
	}

	let msg = Message({from:req.user.userId, to, body});
	await msg.save();

	toUser.unReadSize += 1;
	await toUser.save();
	//await Account.updateOne({userId: to},{$inc:{unReadSize:1}});
	return res.json({msg});
});

router.get('/read-messages', authRequired, async (req, res)=>{
	//let user = await Account.findOneAndUpdate({userId}, {lastRead: new Date(), unReadSize:0});
	let data = await Message.find({to:req.user.userId},{_id:0}).where('timestamp').gt(req.user.lastRead);
	req.user.lastRead = new Date();
	req.unReadSize = 0 ;
	await req.user.save();
	return res.json({data})
});

router.get('/new-message-info',authRequired, (req, res)=>{
	return res.json({unReadSize: req.user.unReadSize, lastRead: req.user.lastRead});
});

module.exports = router;