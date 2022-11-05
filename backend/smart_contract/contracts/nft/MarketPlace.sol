// SPDX-License-Identifier: MIT

pragma solidity 0.8.15;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./NFT.sol";
import '@openzeppelin/contracts/interfaces/IERC20.sol';

contract MarketPlace is ERC721Holder, Ownable{
	using SafeMath for uint256;

	struct Product{
		uint256 price;
		bool isBNB;
		bool forSale;
	}

	mapping(uint256 => Product) private products;

	uint256[] public allProducts;

	address public busdAddress;

	NFT private _store;
	IERC20 _busdToken;
	address payable _storeKeeper;
	
	uint32 public feeBps;//percentage 2%==200/10000 ...
	
	//EVENTS
	event ProductCreated(address owner, uint256 productId);
	event ProductUpdated(address owner, uint256 productId);
	event ProductAdded(uint256 productId);
	event ProductRemoved(uint256 productId);
	event ProductPurchased(address seller, address buyer, uint256 productId, uint256 price);

	event Withdrawal(address keeper, uint256 interest);


	modifier onlyProductOwner(uint256 productId){
		require(_store.isOwnerOf(msg.sender, productId),"Must be owner");
		_;
	}

	modifier productExist(uint256 productId){
		require(products[productId].price != 0);
		_;
	}

	modifier productForSale(uint256 productId){
		require(products[productId].price != 0 && products[productId].forSale);
		_;
	}

	modifier isAllowed(uint256 productId){
		require(_store.getApproved(productId) == address(this),"Must be allowed");
		_;
	}

	constructor(address nftStore, address busdToken, uint32 _feeBps){
		_store = NFT(nftStore);
		_busdToken = IERC20(busdToken);
		busdAddress = busdToken;
		_storeKeeper = payable(msg.sender);
		setFee(_feeBps);
	}

	function setFee(uint32 _feeBps) public onlyOwner{
		feeBps = _feeBps;
	}

	/*
	 *should give the marketplace approval
	 */
	function sellItem(uint256 productId, uint256 price, bool isBNB) public isAllowed(productId) onlyProductOwner(productId){
		require(price != 0,"Price cannot be 0");
		
		if(products[productId].price == 0){
			//register new products
			Product memory newProduct = Product(price + price.mul(feeBps).div(10000), isBNB, true);
			products[productId] = newProduct;
			allProducts.push(productId);
			emit ProductCreated(msg.sender, productId);
		}
		else{
			//change price is product already exist
			products[productId].price = price + price.mul(feeBps).div(10000);

			if(products[productId].isBNB != isBNB){
				products[productId].isBNB = isBNB;
			}
			emit ProductUpdated(msg.sender, productId);
		}
		
	}


	function productInfo(uint256 productId) public view productExist(productId) returns(Product memory){
		return products[productId];
	}

	function size() public view returns (uint256){
		return allProducts.length;
	}

	function get20Products(uint32 index) public view returns (uint256[] memory){
		uint32 from = index*20;
		if(from > allProducts.length){
			return new uint256[](0);
		}

		uint lent = (from + 20) < allProducts.length ?20:allProducts.length-from;
		uint256[] memory list = new uint256[](lent);

		for(uint i=0;i<lent;i++){
			list[i] = allProducts[from + i];
		}
		return list;
	}

	/**
	 *make product [un]available for sale
	 */
	function toggleForSale(uint256 productId) public isAllowed(productId) productExist(productId){
		if(products[productId].forSale){
			products[productId].forSale = false;
			emit ProductAdded(productId);
		}
		else{
			products[productId].forSale = true;
			emit ProductRemoved(productId);
		}
	}

	/**
	 *Product is purchased
	 */
	function _transferItemOwnership(address seller, uint256 productId) private{
		_store.safeTransferFrom(seller, msg.sender, productId);
		products[productId].forSale = false;
	}

	/**
	 * BNB Purchase Type
	 */

	 function purchaseItemBNB(uint256 productId) public isAllowed(productId) productForSale(productId) payable{
	 	//buying condition must be met
		require(products[productId].isBNB,"Can only pay for BNB");
		require(msg.value == products[productId].price,"The amount must be equal to the price");

		address payable seller = payable(_store.ownerOf(productId)); 
		
		uint256 fee = uint256(feeBps).mul(msg.value).div(10000 + feeBps);

		uint256 sellValue = msg.value - fee;
		
		//send some money to seller
		(bool success, ) = seller.call{value:sellValue}("");
		require(success,"Transaction Failed");

		 _transferItemOwnership(seller, productId);
		emit ProductPurchased(seller, msg.sender, productId, sellValue);
	 }

	 /**
	 * BUSD Purchase Type
	 */

	 function purchaseItemBUSD(uint256 productId) public isAllowed(productId) productForSale(productId){
	 	//buying condition must be met
	 	require(!products[productId].isBNB,"Can only pay for BNB");
	 	require(_busdToken.balanceOf(msg.sender)>products[productId].price,"Insufficient Balance");
		uint256 amount = _busdToken.allowance(msg.sender, address(this));
		require(amount == products[productId].price,"The amount must be equal to the price");

		address payable seller = payable(_store.ownerOf(productId)); 
		
		uint256 fee = uint256(feeBps).mul(amount).div(10000 + feeBps);

		uint256 sellValue = amount - fee;
		
		_busdToken.transferFrom(msg.sender, seller, sellValue);
		_busdToken.transferFrom(msg.sender, address(this), _busdToken.allowance(msg.sender, address(this)));

		_transferItemOwnership(seller, productId);
		emit ProductPurchased(seller, msg.sender, productId, sellValue);
	 }

	/**
	 *storeKeeper gets his profit
	 */
	function withdrawBNB() public onlyOwner{
		require(totalInterestBNB()>0, "No funds to withdraw");
		uint256 interest = totalInterestBNB();
		
		(bool success, ) = _storeKeeper.call{value:interest}("");
		require(success,"Transaction Failed");
		
		emit Withdrawal(msg.sender, interest);
	}

	function withdrawBUSD() public onlyOwner{
		require(totalInterestBUSD()>0, "No funds to withdraw");
		uint256 interest = totalInterestBUSD();
		_busdToken.transfer(_storeKeeper,interest);
		
		emit Withdrawal(msg.sender, interest);
	}

	function totalInterestBNB() public view onlyOwner returns(uint256) {
		return address(this).balance;
	}

	function totalInterestBUSD() public view onlyOwner returns(uint256) {
		return _busdToken.balanceOf(address(this));
	}
}