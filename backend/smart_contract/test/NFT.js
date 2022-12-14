const { expect } = require("chai");

const name = "SHIELD PACK"
const symbol = "SHC"

describe("NFT contract", function () {
	let contract;
	let deployer;

 	before("Deploying NFT Contract", async function(){
 		deployer = await ethers.getSigner();
		const factory = await ethers.getContractFactory("NFT");
		contract = await factory.deploy(name, symbol);
		expect(await contract.totalSupply()).to.equal(0);
	});


	it("Create NFT", async function () {
		await contract.mint("The first NFT");
		expect(await contract.totalSupply()).to.equal(1);
	});

	it("get NFT BY ID", async function () {
		expect(await contract.itemInfo(1)).to.include("The first NFT");
	});


	it("Create NFT", async function () {
		await contract.mint("The2NFT");
		expect(await contract.totalSupply()).to.equal(2);
		expect(await contract.itemInfo(2)).to.include("The2NFT");
	});


});