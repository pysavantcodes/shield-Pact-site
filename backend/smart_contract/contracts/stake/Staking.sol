pragma solidity 0.8.15;
//SPDX-License-Identifier: UNLICENSED



import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "../interface/IWBNB.sol";
import "../interface/IBEP20.sol";


contract Staking is Ownable{
    using SafeMath for uint256;
    using Counters for Counters.Counter;
    Counters.Counter private totalStake;

    struct Stake{
        uint256 id;
        address sTk;
        address bTk;
        uint256 amount;
        uint256 endTime;
        uint256 reward;
    }
    
  	 struct Interest{
    	uint256 reward;
    	uint256 totalRewardAmount;
    	uint256 duration;
    }

    //depositor to stakeId
    mapping(address=>uint256[]) ownedStakes;
    

    //map owner to stakeId to stake
    mapping(address=>mapping(uint256=>Stake)) public bank;

   
    //tokenStake to bonusToken to interest
    mapping(address=>mapping(address=>Interest)) public stakeInterest;

    address public WBNB;

    //tokens that can be staked
   	address[] public allStakeTokens;
   	//tokens that can be recieved as bonus
    address[] public allBonusTokens;

    mapping(address=>uint256) public treasure;

    mapping(address=>uint256) public loaned;

    event Staked(uint256 stakeId);
    
    event Claimed(uint256 stakeId);

    event Drained(address sTk, address bTk, uint256 amount);

    event Loaned(address sTk, uint256  amount);

    event LoanPayed(address bTK, uint256 amount, uint256 remaining);
    
    event Withdraw(uint256 amount);
    
    event Deposit(uint256 amount);
    
    modifier rewardAvailable(address sToken, address bToken){
    	require(stakeInterest[sToken][bToken].totalRewardAmount>0,"No Reward to give");
    	_;
    }

    constructor(address _WBNB){
        WBNB = _WBNB;
    }
   	
    function isBNB(address tk) public view returns(bool){
    	return tk == WBNB;
    }

    function tokenExist(address tk) public view returns (bool){
    	return bytes(IBEP20(tk).name()).length > 0;
    }

    function setStakeableBNB(address bToken, uint256 _amount, uint256 _reward, uint256 _totalRewardAmount, uint256 _duration) public onlyOwner{
    	setStakeable(WBNB, bToken, _amount, _reward, _totalRewardAmount, _duration);
    }

    function setStakeable(address sToken, address bToken, uint256 _amount, uint256 _reward, uint256 _totalRewardAmount, uint256 _duration) public onlyOwner{
    
	    require(_amount>0 && _reward>0,"reward/price error");

	    require(_totalRewardAmount > 0 && IBEP20(bToken).allowance(msg.sender, address(this)) == _totalRewardAmount,"Give Right allownace");

	    IBEP20(bToken).transferFrom(msg.sender, address(this), _totalRewardAmount);

	    require(address(0) != sToken && address(0) != bToken,"Null address cannot be 0");

	    require(tokenExist(sToken) && tokenExist(bToken),"Requires that both token exist");

	    require(_duration>0,"incorrect duration");

	    //when new pairs add
	    if(stakeInterest[sToken][bToken].duration == 0){
	       	bool found = false;
	       	for(uint256 index=0; index < allStakeTokens.length; index++){
	       		if(allStakeTokens[index]==sToken){
	       			found = true;
	       			break;
	       		}
	       	}
	       	if(!found){
	       		allStakeTokens.push(sToken);
	       	}

	       	found = false;
	       	for(uint256 index=0; index < allBonusTokens.length; index++){
	       		if(allBonusTokens[index]==bToken){
	       			found = true;
	       			break;
	       		}
	       	}

	       	if(!found){
	       		allBonusTokens.push(bToken);
	       	}
	    }

	    stakeInterest[sToken][bToken].totalRewardAmount += _totalRewardAmount;
	    stakeInterest[sToken][bToken].duration = _duration;
	    stakeInterest[sToken][bToken].reward = _reward.div(_amount);
    }
    
    function getStakeable() public view returns(address[] memory, address[] memory){
       return (allStakeTokens, allBonusTokens);
    }

    function pairExist(address sToken, address bToken) public view returns (bool){
    	return stakeInterest[sToken][bToken].duration > 0;
    }

    function drainToWallet(address sTk, address bTk) public onlyOwner rewardAvailable(sTk, bTk){
    	IBEP20 token = IBEP20(bTk);
    	token.transfer(msg.sender, stakeInterest[sTk][bTk].totalRewardAmount);
    	emit Drained(sTk, bTk, stakeInterest[sTk][bTk].totalRewardAmount);
    	stakeInterest[sTk][bTk].totalRewardAmount = 0;
    }

    function drainBNBToWallet(address sTk) public onlyOwner rewardAvailable(sTk, WBNB){
    	IWBNB token = IWBNB(WBNB);
    	token.withdraw(stakeInterest[sTk][WBNB].totalRewardAmount);
    	(bool success, ) = payable(msg.sender).call{value:stakeInterest[sTk][WBNB].totalRewardAmount}("");
		require(success, "transaction Failed");
    	emit Drained(sTk, WBNB, stakeInterest[sTk][WBNB].totalRewardAmount);
    	stakeInterest[sTk][WBNB].totalRewardAmount = 0;
    }
    
    function getOwnedStake() public view returns(uint256[] memory){
    	return ownedStakes[msg.sender];
    }

    //bnb address
    function stakeBNB(address bTk) public payable rewardAvailable(WBNB, bTk){
        require(msg.value > 0,"cannot be 0");
        IWBNB(WBNB).deposit{value:msg.value}();
        _stake(WBNB, bTk, msg.value);
    }
    
    function stakeToken(address sTk, address bTk, uint256 amount) public rewardAvailable(sTk, bTk){
	    require(amount > 0, "cannot be zero");
	    require(IBEP20(sTk).allowance(msg.sender, address(this))==amount, "Need correct allowance");
	    IBEP20(sTk).transferFrom(msg.sender, address(this), amount);
	    _stake(sTk, bTk, amount);
	}
    
    function _stake(address sTk, address bTk, uint256 amount) private{
        uint256 _reward = interestCalculate(sTk, bTk, amount);
        require(stakeInterest[sTk][bTk].totalRewardAmount > _reward,"Reward not enough to give");
        stakeInterest[sTk][bTk].totalRewardAmount -= _reward;
        treasure[sTk] += amount;
        totalStake.increment();
        uint256 _id = totalStake.current();
        Stake memory newStake = Stake(_id, sTk, bTk, amount, stakeInterest[sTk][bTk].duration + block.timestamp, _reward);
        bank[msg.sender][_id] = newStake;
        ownedStakes[msg.sender].push(_id);
        emit Staked(_id);
    }
    
    function claim(uint256 _id) public{
    	Stake storage _tmp = bank[msg.sender][_id];
    	
        require(_tmp.reward > 0 && bank[msg.sender][_id].amount > 0,"No Reward Available");
    	require(_tmp.endTime > 0, "Already Claimed");
        require(_tmp.endTime <= block.timestamp,"Time not ended");
        require(treasure[_tmp.sTk]>=_tmp.amount,"Your money is still on loan contact admin");
        bank[msg.sender][_id].endTime = 0;
        treasure[_tmp.sTk]-=_tmp.amount;
        
        if(isBNB(_tmp.sTk)){
        	_claimBNB(_tmp.amount);
        }
        else{
        	_claim(_tmp.sTk, _tmp.amount);
        }

        if(isBNB(_tmp.bTk)){
        	_claimBNB(_tmp.reward);
        }
        else{
        	_claim(_tmp.bTk, _tmp.reward);
        }

        emit Claimed(_id);
    }

    function _claimBNB(uint256 amount) private{
    	IWBNB(WBNB).withdraw(amount);
    	(bool success, ) = payable(msg.sender).call{value:amount}("");
    	require(success, "transaction Failed");
    }

    function _claim(address tk, uint256 amount) private{
    	IBEP20(tk).transfer(msg.sender, amount);
    }
    
    function interestCalculate(address sTk, address bTk, uint256 amount) public view returns(uint256) {
        return stakeInterest[sTk][bTk].reward.mul(amount);
    }

    function loan(address sTk, uint256 amount) public onlyOwner{
    	require(treasure[sTk]>amount && amount>0,"Not Enought loan in treasure");
    	IBEP20(sTk).transfer(msg.sender, amount);
    	_loan(sTk, amount);
    }

    function loanBNB(uint256 amount) public onlyOwner{
    	require(treasure[WBNB]>amount && amount>0,"Not Enought loan in treasure");
    	IWBNB(WBNB).withdraw(amount);
    	(bool success, ) = payable(msg.sender).call{value:amount}("");
    	require(success, "transaction Failed");
    	_loan(WBNB, amount);
    }

    function _loan(address sTk, uint256 amount) private{
    	treasure[sTk] -= amount;
    	loaned[sTk] += amount;
    	emit Loaned(sTk, amount);
    }

    function payLoanBNB() public payable{
    	require(msg.value>0,"Sent 0");
    	require(loaned[WBNB]>0,"No loan to pay");
    	IWBNB(WBNB).deposit{value:msg.value}();
    	_payLoan(WBNB, msg.value);
    }

    function payLoan(address sTk, uint256 amount) public{
    	require(loaned[sTk]>0,"No loan to pay");
    	require(amount <= loaned[sTk], "value sent greater than Loan");
    	require(IBEP20(sTk).allowance(msg.sender, address(this))==amount, "Need correct allowance");
	    IBEP20(sTk).transferFrom(msg.sender, address(this), amount);
        _payLoan(sTk, amount);
    }

    function _payLoan(address sTk, uint256 amount) private{
    	treasure[sTk] += amount;
    	loaned[sTk] -= amount;
    	emit LoanPayed(sTk, msg.value, loaned[sTk] - msg.value);
    }

    receive() external payable {
    //added because of WETH
    }

}

