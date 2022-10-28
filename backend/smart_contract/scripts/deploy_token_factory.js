//command to compile
//yarn hardhat compile

//command to deploy
//yarn hardhat run --network localhost ./scripts/deploy_token_factory.js

const mainAccountAddress = "";
const dexRouterAddress = "0xdc4904b5f716Ff30d8495e35dC99c109bb5eCf81";
const _fee = ethers.utils.parseEther("0.000002");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const creators = [];
  for(const _creator of ["StandardTokenCreator", "ReflectionTokenCreator", "LiquidTokenCreator"]){
    const factory = await ethers.getContractFactory(`${_creator}`);
    console.log(`Deploying ${_creator} Contract...`);
    const contract = await factory.deploy();
    console.log(`${_creator} Contract Address: ${contract.address}`);
    creators.push(contract.address);
    await contract.deployed();
  } 

  console.log("Deploying Token Factory...");
  const factory = await ethers.getContractFactory("TokenFactory");
  const contract = await factory.deploy(_fee, dexRouterAddress, ...creators);
  console.log('Token Factory Contarct Address=>', contract.address);
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