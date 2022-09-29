// SPDX-License-Identifier: MIT

pragma solidity 0.8.15;

contract Chat {

	struct Account {
		uint id;
		string userName;
		string privKey;
	}

	mapping(address => Account) accounts;
	uint public totalAccounts = 0;

    modifier addressExist{
    	require(msg.sender != address(0), "Sender must be a zero account");
        _;
    }

	modifier accountRequired{
		require(accountExist(msg.sender),"Account Not Created");
        _;
    }
   
	event CreatedUser(address user);
	
	event KeyChanged(address user);

	constructor(string memory userName, string memory privKey){
		createUser(userName, privKey);
	}

	function _increment() internal{
		totalAccounts++;
	}

	function createUser(string memory userName, string memory privKey) public {
		require(!accountExist(msg.sender),"Account Already Existing");
		_increment();
		accounts[msg.sender] = Account(totalAccounts, userName, privKey);
		emit CreatedUser(msg.sender);
	}

	function getKey() public view accountRequired returns(string memory){
		return accounts[msg.sender].privKey;
	}

	function changeKey(string memory key) public accountRequired {
		accounts[msg.sender].privKey = key;
		emit KeyChanged(msg.sender);
	}

	function accountExist(address _id) public view returns(bool){
    	return accounts[_id].id > 0;
    }

    function getName(address _id) public view returns (string memory){
    	Account storage user = accounts[_id];
    	return user.userName;
    }

}