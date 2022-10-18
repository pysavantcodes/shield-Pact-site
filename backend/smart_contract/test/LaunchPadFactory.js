const { expect} = require("chai");
const {tokenInfo} = require("../scripts/launchpad");


describe("Launch Factory", ()=>{
	let launchPadfactory;
	let Token1, Token2;
	let signers;
	let router;
	const feePrice = "5";
	const fee = ethers.utils.parseEther(feePrice);
	const feePercent = 2;//2%
	const startTime = Math.floor(Date.now()/1000);
	const endTime = startTime + 60*45;//45 mins
	const lockPeriod = 60*60;//1 hour
	let maxBuy = ethers.utils.parseEther("450");
	let minBuy = ethers.utils.parseEther("2");
	let padContarct;
	let contract;

	before(async ()=>{
		signers = await ethers.getSigners();
		router = signers[5].address;
		let factory = await ethers.getContractFactory("Token");
		//Owned by signer2
		Token1 = await factory.deploy("TOKEN_1","TK1", 18);
		await Token1.deployed();
		await Token1.mint(signers[1].address,1e6);
		await Token1.transferOwnership(signers[1].address);
		
		//console.log("Token1 Address =>",Token1.address);
		//Owned by signer3
		expect(await Token1.owner()).to.equal(signers[1].address);
		Token1 = await Token1.connect(signers[1]);

		Token2 = await factory.deploy("TOKEN_2","TK2", 18);
		Token2.deployed();
		await Token2.mint(signers[2].address,1e4);
		await Token2.transferOwnership(signers[2].address);
		//console.log("Token2 Address =>",Token2.address);
		expect(await Token2.owner()).to.equal(signers[2].address);

		factory = await ethers.getContractFactory("LaunchPadFactory");
		launchPadfactory = await factory.deploy(fee, feePercent, Token2.address, router);
		expect(await launchPadfactory.fee()).to.equal(fee);
	});


	//token1 for launchpad
	//token2 for busd

	it("create Launchpad", async()=>{
		const contract = await launchPadfactory.connect(signers[1]);
		const capped = 500;
		let data = await contract.totalTokenNeeded(capped, 200, 150, 80);
		//console.log(data);		
		let result = await Token1.approve(contract.address, data[0]);
		await result.wait();

		result = await contract.createPad(Token1.address, true, 200, 150, 80, capped, [minBuy, maxBuy], 
			[startTime, endTime], lockPeriod, "Some basic Info", false,{value:fee});
		let reciept = await result.wait();

		const factory = await ethers.getContractFactory("LaunchPad");
		padContarct = await factory.attach(reciept.events[reciept.events.length - 1].args.pad);
		let lc = padContarct.connect(signers[1]);
		expect(await lc.saleToken()).to.equal(Token1.address);
		expect(await lc.startTime()).to.equal(startTime);
		//console.log(await Promise.all([lc.remainingToken(), lc.tokenForPreSale()]));
		expect(await lc.remainingToken()).to.not.equal(0);
		expect(await lc.totalTokenSold()).to.equal(0);
		expect(await lc.calculateToken(ethers.utils.parseEther("1"))).to.equal(200);
		expect(await lc.infoHash()).to.equal("Some basic Info");
	});


	it("Purchase", async()=>{
		const lc = await padContarct.connect(signers[7]);
		const lc8 = await padContarct.connect(signers[8]);
		let buyPrice = ethers.utils.parseEther("450");
		let result = await lc.purchaseTokenByBNB({value:buyPrice});
		let reciept = await result.wait();

		expect(reciept.events[reciept.events.length - 1].args.amount).to.equal(200*450);
		expect(await Token1.balanceOf(signers[7].address)).to.equal(reciept.events[reciept.events.length - 1].args.amount);
		expect(await lc.totalTokenSold()).to.equal(200*450);
		result = await lc8.purchaseTokenByBNB({value:ethers.utils.parseEther("50")});
		reciept = await result.wait();
		expect(await lc.totalTokenSold()).to.equal(200*500);
		expect(await lc8.remainingToken()).to.equal((await lc8.tokenForPreSale()) - 500*200);//after purchasing the required feetoken is the remaining token
		expect(await lc8.totalSale()).to.equal(ethers.utils.parseEther("500"));
		expect(await lc.investedAmount(signers[7].address)).to.equal(buyPrice);
		expect(await lc8.investedAmount(signers[8].address)).to.equal(ethers.utils.parseEther("50"));
		expect(await padContarct.LpTokenTime()).to.equal(0);
		let remain = ((await lc.remainingToken())/200).toString()
		result = await lc8.purchaseTokenByBNB({value:ethers.utils.parseEther(remain)});
		Reciept = await result.wait();
	});

	it("Get Fund", async()=>{
		const lc = await padContarct.connect(signers[1]);
		result = await lc.completePreSale();
		//expect(await padContarct.LpTokenTime()).to.not.equal(0); dex not used yet
		/*console.log(await padContarct.LpTokenTime());*/
	});
})