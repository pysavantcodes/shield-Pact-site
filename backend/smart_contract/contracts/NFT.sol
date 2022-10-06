// SPDX-License-Identifier: MIT

pragma solidity 0.8.15;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";

import "hardhat/console.sol";

contract NFT is ERC721, ERC721Burnable, Ownable{

    using Counters for Counters.Counter;
    Counters.Counter private _itemIds;

    string private baseURI; 

	struct Item{
		string description;
        string cid;
		uint256 created;
	}

    // Mapping from ItemId to item
	mapping(uint256 => Item) private _items;

    // Mapping from owner to item
    mapping(address => uint256[]) private _ownedItems;

    //EVENT
    event Minted(address minter, uint256 itemId);

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
    

    /**
     *gets the URI of a item
     */
    function tokenURI(uint256 itemId)public view virtual override returns (string memory) {
        _requireMinted(itemId);
        return string(abi.encodePacked(baseURI,_items[itemId].cid));
    }
    

    /**
     *total Items created
     */
    function totalSupply() external view returns (uint256){
    	return _itemIds.current();
    }

    /**
     *sets base URI
     */
    function setURI(string memory newURI) external onlyOwner {
        require(bytes(newURI).length>0,"Empty string can not be used");
        baseURI = newURI;
    }

    /**
     *minting NFT=>Adding New Item
     */
    function mint(string memory description, string memory cid) public {
    	_itemIds.increment();
    	uint256 newId = _itemIds.current();
    	_safeMint(msg.sender, newId);

    	Item memory newItem = Item(description, cid, block.timestamp);
 		_items[newId] = newItem;

        emit Minted(msg.sender, newId);
    }


    /**
     *burning NFT=>Removing Existing Item
     */
    function burn(uint256 itemId) public override{
    	super.burn(itemId);

        //Item memory oldItem = _items[itemId];
    	delete _items[itemId];
    }


    /**
     *adding to my item list
     */
    function addItemToList(address newOwner, uint256 itemId) private{
        _ownedItems[newOwner].push(itemId);
    }


    /**
     *adding to my item list
     */
    function removeFromItem(address exOwner, uint256 itemId) private{
        uint256[] memory remainItems = new uint256[](_ownedItems[exOwner].length - 1);
        uint256 j = 0;
        for(uint256 i = 0; i < _ownedItems[exOwner].length; i++){
            if(_ownedItems[exOwner][i] != itemId){
                remainItems[j] = _ownedItems[exOwner][i];
                j++;
            }
        }
        _ownedItems[exOwner] = remainItems;
    }

    function itemInfo(uint256 itemId) public view returns (Item memory){
    	_requireMinted(itemId);
    	return _items[itemId];
    }

    function itemCreated() public view returns (uint256[] memory){
        return _ownedItems[msg.sender];
    }


    /**
     * @dev Hook that is called after any transfer of tokens. This includes
     * minting and burning.
     *
     * Calling conditions:
     *
     * - when `from` and `to` are both non-zero.
     * - `from` and `to` are never both zero.
     */
    function _afterTokenTransfer( address from, address to, uint256 itemId) internal virtual override {
        if(from == address(0)){
            addItemToList(to, itemId);
        }

        else if(to == address(0)){
            removeFromItem(from, itemId);
        }

        else{
            addItemToList(to, itemId);
            removeFromItem(from, itemId);
        }
    }
}
