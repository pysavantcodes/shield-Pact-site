pragma solidity 0.8.15;
//SPDX-License-Identifier: UNLICENSED

import {ReflectionToken} from "../token/ReflectionToken.sol";

contract ReflectionTokenCreator{
	
	function createToken(
        address creator,
        string memory name,
        string memory symbol,
        uint8 decimals,
        uint256 totalSupply,
        uint16,
        uint16,
        address 
	) public returns(address){
		ReflectionToken newToken = new ReflectionToken(creator, name, symbol, decimals, totalSupply);
        newToken.transferOwnership(creator);
        return address(newToken);
	}
}