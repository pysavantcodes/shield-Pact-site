

export default {
	nft:{
		address:"0x2E34d25EA268CAA0b855161B661287197831c2a8",
		abi: [
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "symbol",
          "type": "string"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "approved",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "ApprovalForAll",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "minter",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "itemId",
          "type": "uint256"
        }
      ],
      "name": "Minted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "itemId",
          "type": "uint256"
        }
      ],
      "name": "burn",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "getApproved",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        }
      ],
      "name": "isApprovedForAll",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        }
      ],
      "name": "isOwnerOf",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "itemCreated",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "itemId",
          "type": "uint256"
        }
      ],
      "name": "itemInfo",
      "outputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "cid",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "created",
              "type": "uint256"
            }
          ],
          "internalType": "struct NFT.Item",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "cid",
          "type": "string"
        }
      ],
      "name": "mint",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "ownerOf",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "setApprovalForAll",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes4",
          "name": "interfaceId",
          "type": "bytes4"
        }
      ],
      "name": "supportsInterface",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "itemId",
          "type": "uint256"
        }
      ],
      "name": "tokenURI",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ],
	},
	market:{
		address:"0x3dc3592A6aE4aeF4f8dABF7012E5A7A0a4470035",
		abi: [
		    {
		      "inputs": [
		        {
		          "internalType": "address",
		          "name": "nftStore",
		          "type": "address"
		        }
		      ],
		      "stateMutability": "nonpayable",
		      "type": "constructor"
		    },
		    {
		      "anonymous": false,
		      "inputs": [
		        {
		          "indexed": true,
		          "internalType": "address",
		          "name": "previousOwner",
		          "type": "address"
		        },
		        {
		          "indexed": true,
		          "internalType": "address",
		          "name": "newOwner",
		          "type": "address"
		        }
		      ],
		      "name": "OwnershipTransferred",
		      "type": "event"
		    },
		    {
		      "anonymous": false,
		      "inputs": [
		        {
		          "indexed": false,
		          "internalType": "uint256",
		          "name": "productId",
		          "type": "uint256"
		        }
		      ],
		      "name": "ProductAdded",
		      "type": "event"
		    },
		    {
		      "anonymous": false,
		      "inputs": [
		        {
		          "indexed": false,
		          "internalType": "address",
		          "name": "creator",
		          "type": "address"
		        },
		        {
		          "indexed": false,
		          "internalType": "uint256",
		          "name": "productId",
		          "type": "uint256"
		        }
		      ],
		      "name": "ProductCreated",
		      "type": "event"
		    },
		    {
		      "anonymous": false,
		      "inputs": [
		        {
		          "indexed": false,
		          "internalType": "address",
		          "name": "seller",
		          "type": "address"
		        },
		        {
		          "indexed": false,
		          "internalType": "address",
		          "name": "buyer",
		          "type": "address"
		        },
		        {
		          "indexed": false,
		          "internalType": "uint256",
		          "name": "productId",
		          "type": "uint256"
		        },
		        {
		          "indexed": false,
		          "internalType": "uint256",
		          "name": "price",
		          "type": "uint256"
		        }
		      ],
		      "name": "ProductPurchased",
		      "type": "event"
		    },
		    {
		      "anonymous": false,
		      "inputs": [
		        {
		          "indexed": false,
		          "internalType": "uint256",
		          "name": "productId",
		          "type": "uint256"
		        }
		      ],
		      "name": "ProductRemoved",
		      "type": "event"
		    },
		    {
		      "anonymous": false,
		      "inputs": [
		        {
		          "indexed": false,
		          "internalType": "address",
		          "name": "keeper",
		          "type": "address"
		        },
		        {
		          "indexed": false,
		          "internalType": "uint256",
		          "name": "interest",
		          "type": "uint256"
		        }
		      ],
		      "name": "Withdrawal",
		      "type": "event"
		    },
		    {
		      "inputs": [
		        {
		          "internalType": "uint256",
		          "name": "",
		          "type": "uint256"
		        }
		      ],
		      "name": "allProducts",
		      "outputs": [
		        {
		          "internalType": "uint256",
		          "name": "",
		          "type": "uint256"
		        }
		      ],
		      "stateMutability": "view",
		      "type": "function"
		    },
		    {
		      "inputs": [
		        {
		          "internalType": "uint256",
		          "name": "productId",
		          "type": "uint256"
		        },
		        {
		          "internalType": "uint256",
		          "name": "price",
		          "type": "uint256"
		        }
		      ],
		      "name": "changePrice",
		      "outputs": [],
		      "stateMutability": "nonpayable",
		      "type": "function"
		    },
		    {
		      "inputs": [
		        {
		          "internalType": "address",
		          "name": "",
		          "type": "address"
		        },
		        {
		          "internalType": "address",
		          "name": "",
		          "type": "address"
		        },
		        {
		          "internalType": "uint256",
		          "name": "",
		          "type": "uint256"
		        },
		        {
		          "internalType": "bytes",
		          "name": "",
		          "type": "bytes"
		        }
		      ],
		      "name": "onERC721Received",
		      "outputs": [
		        {
		          "internalType": "bytes4",
		          "name": "",
		          "type": "bytes4"
		        }
		      ],
		      "stateMutability": "nonpayable",
		      "type": "function"
		    },
		    {
		      "inputs": [],
		      "name": "owner",
		      "outputs": [
		        {
		          "internalType": "address",
		          "name": "",
		          "type": "address"
		        }
		      ],
		      "stateMutability": "view",
		      "type": "function"
		    },
		    {
		      "inputs": [
		        {
		          "internalType": "uint256",
		          "name": "productId",
		          "type": "uint256"
		        }
		      ],
		      "name": "productInfo",
		      "outputs": [
		        {
		          "components": [
		            {
		              "internalType": "uint256",
		              "name": "price",
		              "type": "uint256"
		            },
		            {
		              "internalType": "bool",
		              "name": "forSale",
		              "type": "bool"
		            }
		          ],
		          "internalType": "struct MarketPlace.Product",
		          "name": "",
		          "type": "tuple"
		        }
		      ],
		      "stateMutability": "view",
		      "type": "function"
		    },
		    {
		      "inputs": [
		        {
		          "internalType": "uint256",
		          "name": "",
		          "type": "uint256"
		        }
		      ],
		      "name": "products",
		      "outputs": [
		        {
		          "internalType": "uint256",
		          "name": "price",
		          "type": "uint256"
		        },
		        {
		          "internalType": "bool",
		          "name": "forSale",
		          "type": "bool"
		        }
		      ],
		      "stateMutability": "view",
		      "type": "function"
		    },
		    {
		      "inputs": [
		        {
		          "internalType": "uint256",
		          "name": "productId",
		          "type": "uint256"
		        }
		      ],
		      "name": "purchaseItem",
		      "outputs": [],
		      "stateMutability": "payable",
		      "type": "function"
		    },
		    {
		      "inputs": [],
		      "name": "renounceOwnership",
		      "outputs": [],
		      "stateMutability": "nonpayable",
		      "type": "function"
		    },
		    {
		      "inputs": [
		        {
		          "internalType": "uint256",
		          "name": "productId",
		          "type": "uint256"
		        },
		        {
		          "internalType": "uint256",
		          "name": "price",
		          "type": "uint256"
		        }
		      ],
		      "name": "sellItem",
		      "outputs": [],
		      "stateMutability": "nonpayable",
		      "type": "function"
		    },
		    {
		      "inputs": [
		        {
		          "internalType": "uint256",
		          "name": "productId",
		          "type": "uint256"
		        }
		      ],
		      "name": "toggleForSale",
		      "outputs": [],
		      "stateMutability": "nonpayable",
		      "type": "function"
		    },
		    {
		      "inputs": [],
		      "name": "totalInterest",
		      "outputs": [
		        {
		          "internalType": "uint256",
		          "name": "",
		          "type": "uint256"
		        }
		      ],
		      "stateMutability": "view",
		      "type": "function"
		    },
		    {
		      "inputs": [
		        {
		          "internalType": "address",
		          "name": "newOwner",
		          "type": "address"
		        }
		      ],
		      "name": "transferOwnership",
		      "outputs": [],
		      "stateMutability": "nonpayable",
		      "type": "function"
		    },
		    {
		      "inputs": [],
		      "name": "withdraw",
		      "outputs": [],
		      "stateMutability": "nonpayable",
		      "type": "function"
		    }
		  ],
	}
}