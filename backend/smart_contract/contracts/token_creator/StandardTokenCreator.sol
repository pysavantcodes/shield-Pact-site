pragma solidity 0.8.15;
//SPDX-License-Identifier: UNLICENSED

import {StandardToken} from "../token/StandardToken.sol";

contract StandardTokenCreator{
	
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
		StandardToken newToken = new StandardToken(creator, name, symbol, decimals, totalSupply);
        newToken.transferOwnership(creator);
        return address(newToken);
	}
}