//command to compile
//yarn hardhat compile

//command to deploy
//yarn hardhat run --network localhost ./scripts/deploy_token_factory.js

const mainAccountAddress = "";
const fee = ethers.utils.parseEther("0.0001");
const router = "0xdc4904b5f716Ff30d8495e35dC99c109bb5eCf81";
const busdAddress = "0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee";

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
    const result =  contract.transferOwnership(mainAccountAddress);
    await result.wait();
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });