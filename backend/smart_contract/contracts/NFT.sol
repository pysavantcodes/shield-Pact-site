// SPDX-License-Identifier: MIT

pragma solidity 0.8.15;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";

contract NFT is ERC721, ERC721Burnable, Ownable {

    using Counters for Counters.Counter;
    Counters.Counter private _itemIds;

	struct Item{
		string itemURI;
		string itemName;//special token name
		uint256 created;
	}

	mapping(uint256 => Item) private _items;


    constructor(string memory name, string memory symbol) ERC721(name, symbol){

    }

    modifier onlyCreator(uint256 id){
    	require(isOwnerOf(msg.sender, id), "Not the creator");
    	_;
    }

    function isOwnerOf(address account, uint256 id) public view returns (bool)
    {
        address owner = ownerOf(id);
        return owner == account;
    }
    
    //gets the URI of a item
    function tokenURI(uint256 itemId)public view virtual override returns (string memory) {
        _requireMinted(itemId);
        return _items[itemId].itemURI;
    }
    
    function totalSupply() external view returns (uint256){
    	return _itemIds.current();
    }

    function setItemURI(uint256 itemId, string memory itemURI) public onlyCreator(itemId) {
    	_requireMinted(itemId);
    	_items[itemId].itemURI = itemURI;
    }

    //minting NFT=>Adding New Item
    function mintNFT(string memory itemName, string memory itemURI) public {
    	_itemIds.increment();
    	uint256 newId = _itemIds.current();
    	_safeMint(msg.sender, newId);
    	//adding the new items
    	Item memory newItem = Item(itemName, itemURI, block.timestamp);
 		_items[newId] = newItem;
    }

    //burning NFT=>Removing Existing Item
    function burnNFT(uint256 itemId) public {
    	burn(itemId);
    	_itemIds.decrement();
    	//removing the Items
    	delete _items[itemId];
    }

    function infoNFT(uint256 itemId) public view returns (Item memory){
    	_requireMinted(itemId);
    	return _items[itemId];
    }
}