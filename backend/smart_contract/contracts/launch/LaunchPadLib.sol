pragma solidity 0.8.15;
//SPDX-License-Identifier: UNLICENSED

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

library LaunchPadLib{
    using SafeMath for uint256;
    /** 
     *capped amount => fund to be raised
     *dexBps => percentage of funds raised to be used for liquidity
     *Add percent fee of raised amount as token to be bought
     */
    
   function BNBTokenSold(
    uint256 capped_,
    uint256 saleRate_,
    uint256 dexRate_,
    uint16 dexBps_,
    uint16 bnbFeeBps_,
    uint16 tkFeeBps_)
    internal pure
    returns (uint256, uint256, uint256, uint256, uint256)
    {
      
        uint256 saleTokens = capped_.mul(saleRate_).div(1 ether);
        
        uint256 dexTokens = capped_;
        dexTokens = dexTokens.mul(dexBps_).div(10**4);
        dexTokens = dexTokens.mul(dexRate_).div(1 ether);
        
        
        uint256 bnbTokens = capped_;
        bnbTokens = bnbTokens.mul(bnbFeeBps_).div(10**4);
        bnbTokens = bnbTokens.mul(saleRate_).div(1 ether);
        
        uint256 tkTokens = saleTokens.mul(tkFeeBps_).div(10**4);
    
        return ((saleTokens + dexTokens + bnbTokens + tkTokens),
        saleTokens, dexTokens, bnbTokens, tkTokens);
    }
    
    function totalTokenSold(
    uint256 capped_,
    uint256 saleRate_,
    uint256 dexRate_,
    uint16 dexBps_,
    uint16 bnbFeeBps_,
    uint16 tkFeeBps_)
    internal pure
    returns (uint256)
    {
       (uint256 t,,,,) = BNBTokenSold(capped_, saleRate_, dexRate_, dexBps_, bnbFeeBps_, tkFeeBps_);
       return t;
    }
    
    function bnbFromToken(uint256 tkAmount, uint256 rate_) internal pure returns (uint256){
        return tkAmount.mul(1 ether).div(rate_);
    }

    function tokenFromBNB(uint256 bnbAmount, uint256 rate_) internal pure returns (uint256){
        return bnbAmount.mul(rate_).div(1 ether);
    }
}