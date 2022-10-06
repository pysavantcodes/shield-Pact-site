const { expect } = require("chai");

describe("Chat contract", function () {
	let contract;

 	before("Deploying Chat Contract", async function(){
 		const [deployer,_] = await ethers.getSigners();
		console.log('Deployer Address is ',deployer.address);
		const Chat = await ethers.getContractFactory("Chat");
		const contract = await Chat.deploy();
	});

});