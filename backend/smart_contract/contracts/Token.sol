// SPDX-License-Identifier: MIT

pragma solidity 0.8.15;

import "./BEP20.sol";

contract Token is BEP20{
	
	constructor(uint _totalSupply) BEP20("BratsToken", "BRT", _totalSupply){
	}
}
