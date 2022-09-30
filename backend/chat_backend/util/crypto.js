const cryptoJs = require('crypto-js');
const {AES} = cryptoJs;

const {v4:randomID} = require("uuid");

const encrypt = (secret, value)=>AES.encrypt(value, secret).toString();

const decrypt = (secret, cipherTxt)=>AES.decrypt(cipherTxt, secret).toString(cryptoJs.enc.Utf8);

const createCipher = (userId, userKey, expires)=>{
	let _txt = randomID();
	let db = {userId, _txt, expires:Date.now() + (expires||60*60*1000)};
	let _hash = encrypt(userKey,JSON.stringify(db));
	return {_id:userId, _hash, _txt};
}

const verifyCipher = (userId, userKey, _hash, _txt)=>{
	//console.log(userId, userKey, _hash, _txt)
	let _obj = decrypt(userKey, _hash);
	_obj = _obj && JSON.parse(_obj);
	//console.log(_obj)
	if(_obj && _obj?.expires && _obj.expires >= Date.now() && 
		_obj?._txt === _txt && _obj?.userId === userId)
	      return true;
	return false;  
}

module.exports = {encrypt, decrypt, randomID, createCipher, verifyCipher}

// creation of user
// when creating account
// generate uuid as key,
// store key in blockchain;
// store key in db server

// logging in
// send key from blockchain to db for verification
// encrypt random uuid 
// send the encrypt uuid and random uuid

// on server
// decrypt uuid and test with uuid
// success