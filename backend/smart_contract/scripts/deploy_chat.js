//command to compile
//yarn hardhat compile

//command to deploy
//yarn hardhat run --network localhost ./scripts/deploy_chat.js

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const Chat = await ethers.getContractFactory("Chat");

  let secretToken = "19b51e19-7ff1-4998-b618-f523d9355e20";
  
  const chatContract = await Chat.deploy("Admin", secretToken);
  console.log("Admin Address ", deployer.address);
  console.log("Admin Secret Token ", secretToken);
  console.log("Chat Contract address:", chatContract.address);
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