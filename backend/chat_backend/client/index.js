const axios = require('axios');
const {createCipher} = require('../util/crypto');
const apiUrl = 'http://localhost:3000/api/chat';

const endPoint = {
	clean: '/clean',//for testnot to be implemented
	createAccount:'/create-account',
	authAccount:'/auth',
	addFriend:'/add-friend',
	getInfo:'/account-info',
	sendMessage:'/send-message',
	getAccounts:'/accounts',
	newMessageInfo:'/new-message-info',
	readNewMessage:'/read-messages',
	paginateMessage:'/paginate-message',
	allMessage:'/all-message',
};

const createClient = (apiUrl)=> axios.create({baseURL: apiUrl, withCredentials:true});

const client = createClient(apiUrl);

const createAccount = async (userName, userId, userKey)=>{
	let result = await client.post(endPoint.createAccount,{userName, userId, userKey});
	return result.data;
}

const authAccount = async (userId, userKey)=>{
	let data = createCipher(userId, userKey);
	result = await client.post(endPoint.authAccount,data);
	return result.data;
}

const clean = async ()=>{
	result = await client.get(endPoint.clean);
	return result.data?.done;
}

const addFriend = async (friendId)=>{
	result = await client.post(endPoint.addFriend, {friendId});
	return result.data;
}

const getInfo = async (id)=>{
	let result =  await client.get(endPoint.getInfo, {params: {id} });
	return result.data;
}

const getAccounts = async ()=>{
	let result = await client.get(endPoint.getAccounts);
	return result.data;
}

const sendMessage = async (to, body)=>{
	let {data} = await client.post(endPoint.sendMessage, {to, body});
	return data;
}

const newMessageInfo = async ()=>{
	let {data} = await client.get(endPoint.newMessageInfo);
	return data;
}

const readNewMessage = async ()=>{
	let {data} = await client.get(endPoint.readNewMessage);
	return data;
}

const paginateMessage = async (to, pstart, plimit, beginTime)=>{
	let {data} = await client.get(endPoint.paginateMessage,{params:{to, pstart, plimit, beginTime}});
	return data;
}

const allMessage = async (pstart, plimit, beginTime)=>{
	let {data} = await client.get(endPoint.paginateMessage,{params:{pstart, plimit, beginTime}});
	return data;
}


module.exports = {createAccount, authAccount, clean, addFriend, getInfo, sendMessage, getAccounts, 
					newMessageInfo, readNewMessage, paginateMessage, allMessage};