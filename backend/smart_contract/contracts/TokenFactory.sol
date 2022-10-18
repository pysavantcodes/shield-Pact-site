pragma solidity 0.8.15;
//SPDX-License-Identifier: UNLICENSED

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Token.sol";

contract TokenFactory is Ownable{
    //Fee
    uint256 public fee;
    //fee Reciever is the owner of the TokenFactory
   
    //Creator to Tokens
    mapping(address => address[]) creatorToken;
    
    //All Tokens
    address[] public allTokens;
    
    event TokenCreated(address creator, address token);
    
    event FeeWithdrawn(uint256 amount);
    
    constructor(uint256 _fee){
        setFee(_fee);
    }
    
    function setFee(uint256 _fee) public onlyOwner{
        require(_fee > 0, "Amount < 0");
        fee = _fee;
    }
    
    modifier paidFee(){
        require(msg.value == fee, "Fee must be paid before creation");
        _;
    }
    
    function createToken(string memory name, string memory symbol, uint8 decimals, uint256 totalSupply) public paidFee payable{
        require(msg.sender != address(0));
        require(totalSupply > 0, "TotalSupply < 0");
        require(bytes(name).length > 0 && bytes(symbol).length > 0, "Name & Symbol required");
        Token newToken = new Token(name, symbol, decimals);
        address tokenAddress = address(newToken);
        newToken.mint(msg.sender, totalSupply);
        newToken.transferOwnership(msg.sender);
        allTokens.push(tokenAddress);
        creatorToken[msg.sender].push(tokenAddress);
        emit TokenCreated(msg.sender, tokenAddress);
    }
    
    function createdToken() public view returns (address[] memory){
        return creatorToken[msg.sender];
    }
    
    function getRecievedFee() public view onlyOwner returns (uint256){
        return address(this).balance;
    }
    
    function withdrawFee() public onlyOwner{
        uint256 feeAmount  = getRecievedFee();
        require(feeAmount > 0, "No Fee to Withdraw");
        address payable reciever = payable(owner());
        (bool success,) = reciever.call{value:feeAmount}("");
        require(success, "Failed");
        emit FeeWithdrawn(feeAmount);
    }

    function lengthOfAllToken() public view returns (uint256){
        return allTokens.length;
    }
}
