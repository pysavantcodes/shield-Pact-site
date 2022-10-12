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

  const factory = await ethers.getContractFactory("Token");
  tokenContract = await factory.deploy(ethers.utils.parseEther('10000.0'));
  await tokenContract.deployed();
  console.log("tokenContract Address => ", tokenContract.address);
  
  const nftFactory = await ethers.getContractFactory("NFT");
  const nftContract = await nftFactory.deploy(name, symbol);
  await nftContract.deployed();
  console.log("NFT Contract address:", nftContract.address);

  console.log("Deploying MarketPlace");

  const marketFactory = await ethers.getContractFactory('MarketPlace');
  const marketContract = await marketFactory.deploy(nftContract.address, tokenContract.address);
  console.log("marketContract address is=> ", marketContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });



// Deploying contracts with the account: 0x712196554d705f00396b9cB7D8384D225E92DF1b
// Account balance: 451682250000000000
// tokenContract Address =>  0x6e0784A31977FB52219C5EFdA75b4081dedCBDD0
// NFT Contract address: 0x686E11CCc8ad69914F3fdd1AFb42712FD3dd36E6
// Deploying MarketPlace
// marketContract address is=>  0x9b17022650f5616B97c0Ad2862AD5348DD0567B1