#SMART CONTRACT

##How to deploy Smart Contract

1. Managing Configuration

At _backend\smart_contract_ update *.env*
```
	PRODUCTION=true
	ADMIN_TOKEN={address of admin token should be specified here}
	ADMIN={address of admin wallet should be specified here}
	NFT_NAME={NFT Name}
	NFT_SYMBOL={NFT Symbol}
	WALLET_KEY={Deployer WALLET KEY}
``` 

2. Deploying to Mainnet
	
```	
	 cd _backend\smart_contract_
	 yarn add .
	 yarn hardhat compile
	 yarn hardhat run ./scripts/deploy_nft.js --network mainnet
	 yarn hardhat run ./scripts/deploy_airdrop.js --network mainnet
	 yarn hardhat run ./scripts/deploy_stake.js --network mainnet
	 yarn hardhat run ./scripts/deploy_swap.js --network mainnet
	 yarn hardhat run ./scripts/deploy_launchpad_factory.js --network mainnet
	 yarn hardhat run ./scripts/deploy_token_factory.js --network mainnet
```

3. copy the addresses from the console and update the addressConfig File at frontend and specify the production mode as true

4. check example_deploy.txt showing a deployment console for testnet