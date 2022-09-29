const { expect } = require("chai");

describe("Chat contract", function () {
	let contract;
	const [deployer,_others] = await ethers.getSigners();
	console.log([deployer,_others])
 	before("Deploying Chat Contract", async function(){
		const Chat = await ethers.getContractFactory("Chat");
		const contract = await Chat.deploy();
		expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
	})

	it("Deployment should assign the total supply of tokens to the owner", async function () {
		
	});
});