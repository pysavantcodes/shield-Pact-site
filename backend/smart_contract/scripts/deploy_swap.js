//command to compile
//yarn hardhat compile

//command to deploy
//yarn hardhat run --network localhost ./scripts/deploy_token_factory.js
const config = require('../config');

const mainAccountAddress = config.admin;
const _fee = ethers.utils.parseEther(config.production?"0.03":"0.0001");
const dexRouterAddress = config.routerAddress;

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  console.log("Deploying Swap");
  const factory = await ethers.getContractFactory("Swap");
  const contract = await factory.deploy(dexRouterAddress, _fee);
  console.log('Swap Contarct Address=>', contract.address);
  await contract.deployed();

  if(mainAccountAddress && deployer.address != mainAccountAddress){
    const result = contract.transferOwnership(mainAccountAddress);
    await result.wait();
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });