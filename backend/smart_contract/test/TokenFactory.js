const { expect} = require("chai");
const {tokenInfo} = require("../scripts/launchpad");


describe("Token Factory", ()=>{
	const feePrice = "0.000002";
	const fee = ethers.utils.parseEther(feePrice);
	const tokenFactoryAddr = "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318";
	let contract;

	before(async ()=>{
		let deployer = await ethers.getSigner();
		contract = await ethers.getContractAt("TokenFactory", tokenFactoryAddr, deployer);
	});

	it("create Token", async()=>{
		
		let result = await contract.createStandardToken("QNN","QueenNewNord",18, 1E6,{value:fee});
		let reciept = await result.wait();

		let tkAddress = reciept.events[reciept.events.length - 1].args.token;
		let signer = await ethers.getSigner();
		let tkInfo = await tokenInfo(signer, tkAddress);
		
		expect(signer.address,"Token Ownership not transferred").to.equal(tkInfo.owner);

		let myToken = await contract.createdToken();
		expect(myToken).to.include(tkAddress);
	});


	it("check Fee", async()=>{
		let result = await contract.getRecievedFee();
		expect(result).to.equal(fee);

		result = await contract.withdrawFee();
		await result.wait();

		result = await contract.getRecievedFee();
		expect(result).to.equal(0);
	});
})