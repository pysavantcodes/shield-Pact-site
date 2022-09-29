//command to compile
//yarn hardhat compile

//command to deploy
//yarn hardhat run --network bsc scripts/deploy.js

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const LancerSquare = await ethers.getContractFactory("LancerSquare");

  const LancerSquareContract = await LancerSquare.deploy();

  console.log("LancerSquare Contract address:", LancerSquareContract.address);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });