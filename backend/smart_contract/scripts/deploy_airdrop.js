//command to compile
//yarn hardhat compile

//command to deploy
//yarn hardhat run --network localhost ./scripts/deploy_token_factory.js

const config = require('../config');
const save = require("./_save");

const mainAccountAddress = config.admin;
const _fee = ethers.utils.parseEther(config.production?"0.5":"0.000005");
const _feeBps = 100; //1%

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  console.log("Deploying AirDrop");
  const factory = await ethers.getContractFactory("AirDrop");
  const contract = await factory.deploy(_fee, _feeBps);
  console.log('AirDrop Contarct Address=>', contract.address);
  await contract.deployed();

  if(mainAccountAddress && deployer.address != mainAccountAddress){
    const result = await contract.transferOwnership(mainAccountAddress);
    await result.wait();
  }
  
  save("AIRDROP",contract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });