pragma solidity 0.8.15;
//SPDX-License-Identifier: UNLICENSED

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Token is ERC20, Ownable{
	
	uint8 private _decimals;
	event Minted(address to, uint256 amount);
	event Burned(address from, uint256 amount);

	constructor(string memory name_, string memory symbol_, uint8 decimals_) ERC20(name_, symbol_){
		_decimals = decimals_;
	}

	function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }

	function mint(address account, uint256 amount) public onlyOwner{
		_mint(account, amount);
		emit Minted(account, amount);
	}

	function burn(uint256 amount) public onlyOwner{
		_burn(msg.sender, amount);
		emit Burned(msg.sender, amount);
	}
}