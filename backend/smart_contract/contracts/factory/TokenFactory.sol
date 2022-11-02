pragma solidity 0.8.15;
//SPDX-License-Identifier: UNLICENSED

import "@openzeppelin/contracts/access/Ownable.sol";

interface TokenCreator {
    function createToken(
        address creator,
        string memory name,
        string memory symbol,
        uint8 decimals,
        uint256 totalSupply,
        uint16 taxFeeBps_,
        uint16 liquidityFeeBps_,
        address router
    ) external returns(address);
}

contract TokenFactory is Ownable{
    //Fee
    uint256 public fee;
    //fee Reciever is the owner of the TokenFactory
   
    //router for liquidity
    address public router;
    //Creator to Tokens
    mapping(address => address[]) creatorToken;
    
    //All Tokens
    address[] public allTokens;
    

    //Token creators
    address private StandardCreator;
    address private ReflectCreator;
    address private LiquidCreator;

    event TokenCreated(address creator, address token);
    
    event FeeWithdrawn(uint256 amount);
    
    modifier propertyComplete(string memory name, string memory symbol, uint256 totalSupply){
        require(msg.value == fee, "Fee needed");
        require(msg.sender != address(0));
        require(totalSupply > 0, "TotalSupply < 0");
        require(bytes(name).length > 0 && bytes(symbol).length > 0, "Name & Symbol required");
        _;  
    }

    constructor(uint256 _fee, address _router, address StandardCreator_, address ReflectCreator_, address LiquidCreator_){
        setRouter(_router);
        setFee(_fee);

        StandardCreator = StandardCreator_;
        ReflectCreator = ReflectCreator_;
        LiquidCreator = LiquidCreator_;
    }
    

    function setRouter(address _router) public onlyOwner{
        require(_router != address(0),"Router Address null");
        router = _router;
    }

    function setFee(uint256 _fee) public onlyOwner{
        require(_fee > 0, "Amount < 0");
        fee = _fee;
    }
    
    function _saveToken(address tokenAddress) private{
        allTokens.push(tokenAddress);
        creatorToken[msg.sender].push(tokenAddress);
        emit TokenCreated(msg.sender, tokenAddress);
    }

    function createStandardToken(string memory name, string memory symbol, uint8 decimals, uint256 totalSupply) public payable propertyComplete(name, symbol, totalSupply){

        address newToken = TokenCreator(StandardCreator).createToken(msg.sender, name, symbol, decimals, totalSupply,0,0,router);
        _saveToken(newToken);
    }

    function createLiquidToken(string memory name,
        string memory symbol,
        uint8 decimals,
        uint256 totalSupply,
        uint16 taxFeeBps_,
        uint16 liquidityFeeBps_) public payable propertyComplete(name, symbol, totalSupply){

        address newToken = TokenCreator(LiquidCreator).createToken(msg.sender, name, symbol, decimals, totalSupply, taxFeeBps_, liquidityFeeBps_, router);
        _saveToken(newToken);
    }

    function createReflectToken(string memory name, string memory symbol, uint8 decimals, uint256 totalSupply) public payable propertyComplete(name, symbol, totalSupply){ 
        address newToken = TokenCreator(ReflectCreator).createToken(msg.sender, name, symbol, decimals, totalSupply,0,0,router);
        _saveToken(newToken);    
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

