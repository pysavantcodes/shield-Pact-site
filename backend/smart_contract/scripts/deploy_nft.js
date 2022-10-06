//command to compile
//yarn hardhat compile

//command to deploy
//yarn hardhat run --network localhost ./scripts/deploy_nft.js

const symbol = 'SHC';
const name = 'SHIELD PACT';

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const nftFactory = await ethers.getContractFactory("NFT");
  
  const nftContract = await nftFactory.deploy(name, symbol);
  console.log(nftContract);
  console.log("NFT Contract address:", nftContract.address);
  console.log("Deploying MarketPlace");
  const nftAddress = (await nftContract.deployed()).address;

  const marketFactory = await ethers.getContractFactory('MarketPlace');
  const marketContract = await marketFactory.deploy(nftAddress);
  console.log("marketContract address is=> ", marketContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });