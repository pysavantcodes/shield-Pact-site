//command to compile
//yarn hardhat compile

//command to deploy
//yarn hardhat run --network localhost ./scripts/deploy_chat.js

const config = require('../config');
const save = require("./_save");

const mainAccountAddress = config.admin;
const BonusAddress = config.adminToken; 
let WBNBAddress = config.wbnb;
const duration = 24*60*60;//24hours

async function main() {
  const [deployer] = await ethers.getSigners();
  let {parseEther, formatEther} = ethers.utils;
  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

    if(!WBNBAddress && config.production){
      throw Error("Production Need WBNB Address");
    }

    if(!WBNBAddress){
      console.log("Deploying WBNB");
      factory = await ethers.getContractFactory("WETH");
      bnb = await factory.deploy();
      await bnb.deployed();
      WBNBAddress = bnb.address;
      console.log("WBNB address=>",bnb.address);
    }

    console.log('Deploying Staking')
    factory = await ethers.getContractFactory("Staking");
    stake = await factory.deploy(bnb.address);
    console.log("Staking Contract Address=>", stake.address);
    await stake.deployed();

    //result = await stake.setStakeableBNB(BonusAddress, parseEther("0.00001"), parseEther("3"), parseEther("5000000"), duration);
    //await result.wait();

    if(mainAccountAddress && deployer.address != mainAccountAddress){
      const result = await contract.transferOwnership(mainAccountAddress);
      await result.wait();
    }

    save("STAKE", stake.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// Admin Address  0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
// Admin Secret Token  19b51e19-7ff1-4998-b618-f523d9355e20
// Chat Contract address: 0x5FC8d32690cc91D4c39d9d3abcBD16989F875707