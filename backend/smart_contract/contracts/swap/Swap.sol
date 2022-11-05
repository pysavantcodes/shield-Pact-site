pragma solidity 0.8.15;
//SPDX-License-Identifier: UNLICENSED

import "@openzeppelin/contracts/access/Ownable.sol";
import "../interface/IERC20.sol";

interface Router {
    
    function WETH() external view returns (address);
    
    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external
        returns (uint[] memory amounts);
    
    function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline)
        external
        payable
        returns (uint[] memory amounts);
        
   function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)
        external
        returns (uint[] memory amounts);
}

contract Swap is Ownable{

    uint256 public fee;
    Router public router;


    modifier paidFee(){
        require(msg.value>=fee,"fee required");
        _;
    }

    constructor(address router_, uint256 fee_){
        setRouter(router_);
        setFee(fee_);
    }
    
    function setFee(uint256 fee_) public onlyOwner{
        fee = fee_;
    }
    
    function setRouter(address router_) public onlyOwner{
       router = Router(router_);
    }
    
    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        uint deadline
    ) public payable paidFee returns (uint[] memory amounts){
        
        IERC20(path[0]).transferFrom(msg.sender, address(this), amountIn);
        IERC20(path[0]).approve(address(router), amountIn);

        (bool sent, ) = payable(owner()).call{value:fee}("");
        require(sent,"Could not pay fee");

        return router.swapExactTokensForTokens(amountIn, amountOutMin, path, msg.sender, deadline);
    }

    function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, uint deadline)
        external
        payable
        paidFee
        returns (uint[] memory amounts){
        
        IERC20(path[0]).transferFrom(msg.sender, address(this), amountIn);
        IERC20(path[0]).approve(address(router), amountIn);

        (bool sent, ) = payable(owner()).call{value:fee}("");
        require(sent,"Could not pay fee");

        return router.swapExactTokensForETH(amountIn, amountOutMin, path, msg.sender, deadline);
    }

    function swapExactETHForTokens(uint amountOutMin, address[] calldata path, uint deadline)
        external
        payable
        paidFee
        returns (uint[] memory amounts){
            uint256 _amount = msg.value - fee;

            (bool sent, ) = payable(owner()).call{value:fee}("");
            require(sent,"Could not pay fee");

            return router.swapExactETHForTokens{value:_amount}(amountOutMin, path, msg.sender, deadline);
    }

    function withdrawFee() public onlyOwner{
        require(address(this).balance>0,"No Withdraw");
        (bool sent,) = payable(msg.sender).call{value:address(this).balance}("");
        require(sent,"Transaction failed");
    }

    function getRecievedFee() public view onlyOwner returns(uint256){
        return address(this).balance;
    }
}