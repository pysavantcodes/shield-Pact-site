//command to compile
//yarn hardhat compile

//command to deploy
//yarn hardhat run --network localhost ./scripts/deploy_token_factory.js

const feePrice = "0.00005";
const fee = ethers.utils.parseEther(feePrice);
const feePercent = 1;//2%
const router = "0x10ED43C718714eb63d5aA57B78B54704E256024E";
const busdAddress = "0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee";
async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

      //Owned by signer2
    factory = await ethers.getContractFactory("Token");
    Token1 = await factory.deploy("TOKEN_TEST","TTEST", 18);
    await Token1.deployed();
    await Token1.mint(deployer.address,1e6);
  
    console.log("Token Address =>",Token1.address);

    factory = await ethers.getContractFactory("LaunchPadFactory");
    launchPadfactory = await factory.deploy(fee, feePercent, busdAddress, router);
    console.log("LaunchPadFactory =>", launchPadfactory.address);
    await launchPadfactory.deployed();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });