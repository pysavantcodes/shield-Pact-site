const express = require('express');
const {Account, Message} = require('../model');
const {authRequired, verifyAuth, logOut} = require('../util/auth');

const router = express.Router();

router.post('/create-account', async(req, res)=>{
	let {userId, userName, userKey} = req.body;
	let account = await Account.findOne({userId});
	if(account){
		res.status(401);
		return res.json({msg:'Account Already Exist',userId});
	}
	account = Account({userId, userName, userKey});
	await account.save();
	return res.json({userId:account.userId});
});

router.get('/accounts', async(req, res)=>{
	let accounts = await Account.find({},{_id:0,userId:1});
	return res.json(accounts.map(x=>x.userId));
});

router.get('/account-info', async(req, res)=>{
	let {id} = req.query;

	let account;

	if(req.user?.userId === id){
		account = req.user;
	}
	else{
		account = await Account.findOne({userId:id});
		if(!account)
			return res.json({msg:'Account Not Exist', error:true});
	}
	
	let {userId, userName, lastRead, unReadSize, friends} = account;
	return res.json({userId, userName, lastRead, unReadSize, friends});
});

router.post('/auth',verifyAuth, (req, res)=>{
	if(process.env.ENVIRON !== "PRODUCTION")
		req.app.locals.user = req.user;
	return res.json({userId:req.user.userId});
});

router.post('/add-friend', authRequired, async(req, res)=>{
	let {friendId} = req.body;

	if(req.user.userId === friendId){
		res.status(400);
		return res.json({error:true, msg:"userId and FriendId can not be equal"})
	}

	if(req.user.friends.includes(friendId))
		return res.json({friendId, msg:"Already Friends"});

	let friend = await Account.findOne({userId: friendId});

	if(!friend){
		res.status(400)
		return res.json({error:true, msg:"Friend account does not exist"})
	}

	req.user.friends.push(friendId);
	friend.friends.push(req.user.userId);

	await req.user.save();
	await friend.save();
	return res.json({friendId});
});

router.get('/logout', logOut, (req, res)=>{
	return res.json({logout:true})
});

router.get('/clean', async(req, res)=>{
	let result = await Account.deleteMany({});
	return res.json({done:(await Account.find({})).length === 0})
});


module.exports = router;