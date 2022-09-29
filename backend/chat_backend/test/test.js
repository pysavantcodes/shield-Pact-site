const chai = require('chai');;
const {expect} = chai;
const {describe, it, before} = require('mocha');
const {faker} = require('@faker-js/faker');
const client = require('../client');
const {createCipher} = require('../util/crypto');

const fakeAccount = Array(10).fill(0).map(()=>({userId:faker.datatype.uuid(), userName:faker.internet.userName(), userKey:faker.datatype.uuid()}));
const account1 ={...fakeAccount[0]}
const account2 ={...fakeAccount[1]}
const headers = {};

describe('Account test', ()=>{
	before(async()=>{
		result = await client.clean();
		expect(result,"Database Error").to.be.true;
	});

	it("Account Creation", async()=>{
		let result =  await client.createAccount(account1.userName, account1.userId, account1.userKey);
		expect(account1.userId, "Account creation Failed").to.equal(result.userId);
		result = await client.createAccount(account1.userName, account2.userId, account1.userKey);
		expect(account2.userId, "Account creation Failed").to.equal(result.userId);
	});

	it("Account Auth", async ()=>{
		let result = await client.authAccount(account1.userId, account1.userKey);
		expect(account1.userId, "Account Authorization Failed").to.equal(result.userId);
	});

	it('Make Account 1 and 2 Friends',async ()=>{
		let result = await client.addFriend(account2.userId);
		expect(result.error,result.msg).to.be.undefined;
		expect(result.msg,result.msg).to.be.undefined;
		expect(result.friendId,"Can not add Friend").to.equal(account2.userId);
	});

	it('Already Friends to Account 1',async ()=>{
		let result = await client.addFriend(account2.userId);
		expect(result.msg, result.msg).to.not.be.undefined;
		expect(result.friendId,"Can not add Friend").to.equal(account2.userId);
	});

	it('Erorr if Friend Account does not exist',async ()=>{
		try{
			let _ = await client.addFriend(fakeAccount[5].userId);	
		}catch(e){	
			expect(e.response.data.error).to.be.true;
		}
	});

	it('Error if making userId as Friend',async ()=>{
		try{
			let result = await client.addFriend(account1.userId);
		}catch(e){
			expect(e.response.data.error).to.be.true;
		}
	});

	it('Getting Account Info', async ()=>{
		let result = await client.getInfo(account1.userId);
		expect(result.userName,result.msg).to.be.equal(account1.userName);
	});

	it('Account List', async ()=>{
		let result = await client.getAccounts();
		expect(result,"No empty").to.not.be.empty;
		expect(result,"Account List Not Complete").to.include(account2.userId);
	});
});


describe('Message Test', async ()=>{
	before(async()=>{
		result = await client.clean();
		expect(result,"Database Error").to.be.true;
	});

	it('Create Account',async ()=>{
		for(let account of fakeAccount){
			let {userName, userId, userKey} = account;
			result = await client.createAccount(userName, userId, userKey);
			expect(account.userId, "Account creation Failed").to.equal(result.userId);
		}
	});

	it("Account 2 Auth", async ()=>{
		let result = await client.authAccount(account2.userId, account2.userKey);
		expect(account2.userId, "Account Authorization Failed").to.equal(result.userId);
	});

	it('Making Much Friends',async ()=>{
		for(let i = 0; i < fakeAccount.length - 1; i++){
			if(i===1)
				continue;
			let result = await client.addFriend(fakeAccount[i].userId);
			expect(result.msg, result.msg).to.be.undefined;
			expect(result.friendId,"Can not add Friend").to.equal(fakeAccount[i].userId);
		}
		let userinfo = await client.getInfo(fakeAccount[6].userId);
		expect(userinfo.friends, "Friends not added completely").to.include(account2.userId);
	});


	it('Send Message', async ()=>{
		for(let i = 2; i < fakeAccount.length - 1; i++){
			let result = await client.sendMessage(fakeAccount[i].userId, `${account2.userId} to ${fakeAccount[i].userId}`);
			expect(result.msg, result.msg).to.include({from:account2.userId, to:fakeAccount[i].userId, body:`${account2.userId} to ${fakeAccount[i].userId}`});
			
			result = await client.sendMessage(account1.userId, `${account2.userId} to ${fakeAccount[i].userId} Message Forwarded to ${account1.userId}`);
			expect(result.msg, result.msg).to.include({from:account2.userId, to:account1.userId, 
								body:`${account2.userId} to ${fakeAccount[i].userId} Message Forwarded to ${account1.userId}`});
		}
	});


	it("Account 1 Auth", async ()=>{
		let result = await client.authAccount(account1.userId, account1.userKey);
		expect(account1.userId, "Account Authorization Failed").to.equal(result.userId);
	});

	it('Read Message', async()=>{
		let {data:result} = await client.readNewMessage();
		expect(result).to.not.be.empty;
		expect(result[0].from).to.equal(account2.userId);

		result = await client.readNewMessage();
		expect(result.data).to.be.empty;

		result = await client.newMessageInfo();
		expect(result.unReadSize,"No New Message").to.equal(0);
	});

	it('Paginate Message between account1 and account2', async()=>{
		let sms1 = await client.paginateMessage(account2.userId);
		expect(sms1.data).to.not.be.empty;

		let sms2 = await client.paginateMessage(account2.userId,1,5);
		expect(sms2.data.length).to.not.be.undefined;
		expect(sms2.data[0].body).to.be.equal(sms1.data[5].body);
	});
});
