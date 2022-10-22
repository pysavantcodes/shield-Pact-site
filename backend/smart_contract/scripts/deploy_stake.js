//command to compile
//yarn hardhat compile

//command to deploy
//yarn hardhat run --network localhost ./scripts/deploy_chat.js



async function main() {
  const [deployer] = await ethers.getSigners();
  let {parseEther, formatEther} = ethers.utils;
  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  let [_,...clients] = await ethers.getSigners();
    let factory = await ethers.getContractFactory("Token");
    bonusToken = await factory.deploy("Bonus Token", "BT", 18);
    await bonusToken.deployed();
    let result = await bonusToken.mint(deployer.address, parseEther("1000000000"));
    console.log("BonusToken deployed address=>", bonusToken.address);
    await result.wait();
    stakeToken = await factory.deploy("Stake Token", "ST", 18);
    await stakeToken.deployed();
    result= await stakeToken.mint(deployer.address, parseEther("1000000000"));
    console.log("stakeToken deployed address=>", stakeToken.address);
    await result.wait();

    factory = await ethers.getContractFactory("WETH");
    bnb = await factory.deploy();
    await bnb.deployed();
    console.log("WBNB address=>",bnb.address);

    factory = await ethers.getContractFactory("Staking");
    stake = await factory.deploy(bnb.address);
    await stake.deployed();
    const duration = 24*60*60;//24hours
  
    result = await bonusToken.approve(stake.address, parseEther("5000000"));
    await result.wait();
    console.log(formatEther(await bonusToken.allowance(clients[0].address, stake.address)));
    result = await stake.setStakeableBNB(bonusToken.address, parseEther("0.00001"), parseEther("3"), parseEther("5000000"), duration);
    await result.wait();
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