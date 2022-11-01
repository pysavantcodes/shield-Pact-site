//command to compile
//yarn hardhat compile

//command to deploy
//yarn hardhat run --network localhost ./scripts/deploy_token_factory.js

const config = require('../config');
const save = require("./_save");


const mainAccountAddress = config.admin;
const fee = ethers.utils.parseEther(config.production?"1":"0.0001");
const router = config.routerAddress;
const busdAddress = config.busdAddress;



async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  console.log('Deploying LaunchPadFactory');
  factory = await ethers.getContractFactory("LaunchPadFactory");
  launchPadfactory = await factory.deploy(fee, busdAddress, router);
  console.log("LaunchPadFactory =>", launchPadfactory.address);
  await launchPadfactory.deployed();

  if(mainAccountAddress && deployer.address != mainAccountAddress){
    const result =  await contract.transferOwnership(mainAccountAddress);
    await result.wait();
  }

  save("LAUNCHPADFACTORY",launchPadfactory.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });