//command to compile
//yarn hardhat compile

//command to deploy
//yarn hardhat run --network localhost ./scripts/deploy_token_factory.js


async function main() {
  const [deployer] = await ethers.getSigners();
  const _fee = "0.0000002";
  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const factory = await ethers.getContractFactory("TokenFactory");
  const fee = ethers.utils.parseEther(_fee);//2BNB
  const contract = await factory.deploy(fee);
  console.log('Token Factory Contarct Address=>', contract.address);
  await contract.deployed();  
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });