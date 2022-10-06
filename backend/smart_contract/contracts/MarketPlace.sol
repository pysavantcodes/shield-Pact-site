// SPDX-License-Identifier: MIT

pragma solidity 0.8.15;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "./NFT.sol";

contract MarketPlace is ERC721Holder, Ownable{
	
	struct Product{
		uint256 price;
		bool forSale;
	}

	mapping(uint256 => Product) public products;

	uint256[] public allProducts;

	NFT private _store;
	address payable _storeKeeper;
	uint256 fee=50;
	
	//EVENTS
	event ProductCreated(address creator, uint256 productId);
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

	constructor(address nftStore){
		_store = NFT(nftStore);
		_storeKeeper = payable(msg.sender);
	}

	/*
	 *should give the marketplace approval
	 */
	function sellItem(uint256 productId, uint256 price) public isAllowed(productId) onlyProductOwner(productId){
		require(products[productId].price == 0,"Product already in market");
		require(price != 0,"Price cannot be 0");
		Product memory newProduct = Product(price,true);
		products[productId] = newProduct;
		allProducts.push(productId);
		emit ProductCreated(msg.sender, productId);
	}

	function changePrice(uint256 productId, uint256 price) public isAllowed(productId) productExist(productId) 
	onlyProductOwner(productId){
		require(price != 0,"Price cannot be 0");
		products[productId].price = price;
	}

	function productInfo(uint256 productId) public view productExist(productId) returns(Product memory){
		return products[productId];
	}


	/**
	 *make product [un]available for sale
	 */
	function toggleForSale(uint256 productId) public isAllowed(productId) productExist(productId){
		if(products[productId].forSale){
			products[productId].forSale = false;
			//_store.approve(address(0), productId);
			emit ProductAdded(productId);
		}
		else{
			products[productId].forSale = true;
			//_store.approve(address(this), productId);
			emit ProductRemoved(productId);
		}
	}

	/**
	 *Product is purchased
	 */
	function purchaseItem(uint256 productId) public isAllowed(productId) productForSale(productId) payable{
		//buying condition must be met
		require(msg.value == products[productId].price,"The amount must be equal to the price");
		address payable seller = payable(_store.ownerOf(productId)); 
		
		uint sellValue = msg.value - fee;
		
		//send some money to seller
		seller.transfer(sellValue);

		_store.safeTransferFrom(seller, msg.sender, productId);
		products[productId].forSale = false;
		emit ProductPurchased(seller, msg.sender, productId, sellValue);
	}

	/**
	 *storeKeeper gets his profit
	 */
	function withdraw() public onlyOwner{
		require(address(this).balance>0, "No funds to withdraw");
		uint256 interest = address(this).balance;
		_storeKeeper.transfer(interest);
		emit Withdrawal(msg.sender, interest);
	}

	function totalInterest() public view onlyOwner returns(uint256) {
		return address(this).balance;
	}
}