

interface Router {
    
    function WETH() external view returns (address);
    
    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external
        virtual
        override
        returns (uint[] memory amounts);
    
    function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline)
        external
        virtual
        override
        payable
        returns (uint[] memory amounts);
        
   function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)
        external
        virtual
        override
        returns (uint[] memory amounts);
}

contract Swap is Ownable{

    uint256 public fee;
    address router;
    constructor(address router_, uint256 fee_){
        setRouter(router_);
        setFee(fee_);
    }
    
    function setFee(uint256 fee_) public onlyOwner{
        fee = fee_;
    }
    
    function setRouter(address router_) public onlyOwner{
        router = router_;
    }
    
    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) public payable return {
        
    }
    
}