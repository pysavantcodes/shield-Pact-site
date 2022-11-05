const { expect} = require("chai");
const {tokenInfo} = require("../scripts/launchpad");


describe("Launch Factory", ()=>{
	let launchPadfactory;
	let Token1, Token2;
	let signers;
	let router;
	const feePrice = "5";
	const fee = ethers.utils.parseEther(feePrice);
	const feeBps = 500;//5%
	const startTime = Math.floor(Date.now()/1000)-2000;
	const endTime = startTime + 60*45;//45 mins
	const lockPeriod = 60*60;//1 hour
	let maxBuy = ethers.utils.parseEther("600");
	let minBuy = ethers.utils.parseEther("2");
	let padContarct;
	let contract;

	before(async ()=>{
		signers = await ethers.getSigners();
		router = signers[5].address;
		let factory = await ethers.getContractFactory("StandardToken");
		//Owned by signer2
		Token1 = await factory.deploy(signers[1].address, "TOKEN_1","TK1", 18, ethers.utils.parseUnits("1000000",18));
		await Token1.deployed();
		await Token1.transferOwnership(signers[1].address);
		//console.log("Token1 Address =>",Token1.address);
		//Owned by signer3
		expect(await Token1.owner()).to.equal(signers[1].address);
		Token1 = await Token1.connect(signers[1]);

		Token2 = await factory.deploy(signers[2].address, "TOKEN_2","TK2", 18, ethers.utils.parseUnits("1000000",18));
		Token2.deployed();
		await Token2.transferOwnership(signers[2].address);
		//console.log("Token2 Address =>",Token2.address);
		expect(await Token2.owner()).to.equal(signers[2].address);

		factory = await ethers.getContractFactory("LaunchPadFactory");
		launchPadfactory = await factory.deploy(fee, Token2.address, router);
		expect(await launchPadfactory.fee()).to.equal(fee);
	});


	//token1 for launchpad
	//token2 for busd

	it("create Launchpad", async()=>{
		let {parseUnits, parseEther} = ethers.utils;
		const contract = await launchPadfactory.connect(signers[1]);
		const capped = parseEther("1");
	
		const pu = (v)=>parseUnits(v, 18);

		let data = await contract.totalTokenNeeded(capped, pu("17"), pu("11"), 8000, feeBps,0);
		console.log(data);
		console.log("=> ",ethers.utils.formatUnits(data,18));	
		let result = await Token1.approve(contract.address, data);
		await result.wait();
		console.log('allowance', await Token1.allowance(signers[1].address, contract.address));
		console.log('balanceOf', await Token1.balanceOf(signers[1].address));
		result = await contract.createPad(0, Token1.address, true, capped, 8000, [pu("17"), pu("11")], [minBuy, maxBuy], 
			[startTime, endTime], lockPeriod, "Some basic Info", false,{value:fee});
		
		let reciept = await result.wait();

		// const factory = await ethers.getContractFactory("LaunchPad");
		// padContarct = await factory.attach(reciept.events[reciept.events.length - 1].args.pad);
		// let lc = padContarct.connect(signers[1]);
		// expect(await lc.saleToken()).to.equal(Token1.address);
		// expect(await lc.startTime()).to.equal(startTime);
		// //console.log(await Promise.all([lc.remainingToken(), lc.tokenForPreSale()]));
		// expect(await lc.remainingToken()).to.not.equal(0);
		// expect(await lc.totalTokenSold()).to.equal(0);
		// expect(await lc.calculateToken(ethers.utils.parseEther("1"))).to.equal(pu("200"));
		// expect(await lc.infoHash()).to.equal("Some basic Info");
	});


	/*it("Purchase", async()=>{
		const lc = await padContarct.connect(signers[7]);
		const lc8 = await padContarct.connect(signers[8]);
		let buyPrice = ethers.utils.parseEther("450");
		let result = await lc.purchaseTokenByBNB({value:buyPrice});
		let reciept = await result.wait();

		expect(reciept.events[reciept.events.length - 1].args.amount).to.equal(ethers.utils.parseEther(`${450*200}`));
		expect(await Token1.balanceOf(signers[7].address)).to.equal(reciept.events[reciept.events.length - 1].args.amount);
		expect(await lc.totalTokenSold()).to.equal(ethers.utils.parseEther(`${450*200}`));
		result = await lc8.purchaseTokenByBNB({value:ethers.utils.parseEther("50")});
		reciept = await result.wait();

		expect(await lc.totalTokenSold()).to.equal(ethers.utils.parseEther(`${500*200}`));
		
		expect(+ethers.utils.formatEther(await lc8.remainingToken())).to.equal(+ethers.utils.formatEther(await lc8.tokenForPreSale())  - 500*200);//after purchasing the required feetoken is the remaining token
		
		expect(await lc8.totalSale()).to.equal(ethers.utils.parseEther("500"));

		expect(await lc.investedAmount(signers[7].address)).to.equal(buyPrice);
		expect(await lc8.investedAmount(signers[8].address)).to.equal(ethers.utils.parseEther("50"));
		expect(await padContarct.LpTokenTime()).to.equal(0);
		//console.log(+ethers.utils.formatEther(await lc.remainingToken()));
		let remain = +ethers.utils.formatEther(await lc.remainingToken())/200;
		result = await lc8.purchaseTokenByBNB({value:ethers.utils.parseEther(remain.toString())});
		reciept = await result.wait();
		expect(await lc.remainingToken()).to.equal(0);
	});

	it("Get Fund", async()=>{
		const lc = await padContarct.connect(signers[1]);
		result = await lc.completePreSale();
		//expect(await padContarct.LpTokenTime()).to.not.equal(0); dex not used yet
		//console.log(await padContarct.LpTokenTime());
	});*/
})