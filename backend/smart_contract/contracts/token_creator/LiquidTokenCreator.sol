pragma solidity 0.8.15;
//SPDX-License-Identifier: UNLICENSED

import {LiquidityGeneratorToken} from "../token/LiquidityGeneratorToken.sol";

contract LiquidTokenCreator{
	
	function createToken(
		address creator,
		string memory name,
		string memory symbol,
        uint8 decimals,
        uint256 totalSupply,
        uint16 taxFeeBps_,
        uint16 liquidityFeeBps_,
        address router
	) public returns(address){
		LiquidityGeneratorToken newToken = new LiquidityGeneratorToken(creator, name, symbol, decimals, totalSupply, router, taxFeeBps_, liquidityFeeBps_);
		newToken.transferOwnership(creator);
        return address(newToken);
	}
}