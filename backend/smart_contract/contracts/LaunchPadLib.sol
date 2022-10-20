pragma solidity 0.8.15;
//SPDX-License-Identifier: UNLICENSED


import "@openzeppelin/contracts/utils/math/SafeMath.sol";

library LaunchPadLib{
    using SafeMath for uint256;
    /** 
     *capped amount => fund to be raised
     *dexPercent => percentage of funds raised to be used for liquidity
     *Add percent fee of raised amount as token to be bought
     */
    function totalTokenNeeded(uint256 _capped, uint256 _saleRate, uint256 _dexRate, uint8 _dexPercent, uint8 _feePercent) 
    internal pure returns (uint256, uint256, uint256, uint256)
    {
        //result to be divided by 1ether
        uint256 nCap = 1 ether;

        uint256 _SaleToken =  _saleRate.mul(_capped).div(nCap);
        uint256 _DexToken;
        {
            _DexToken = _capped.mul(_dexRate).mul(_dexPercent);
            _DexToken = _DexToken.div(100);
            _DexToken = _DexToken.div(nCap);
        }

        uint256 _feePrice;
        {
            _feePrice = _capped.mul(_feePercent);
            _feePrice = _feePrice.div(100);
        }

        uint256 _FeeToken = _feePrice.mul(_saleRate).div(nCap);
          
        return ((_SaleToken +  _DexToken + _FeeToken), _SaleToken, _DexToken, _feePrice);
    }
}