const { expect } = require("chai");

const name = "SHIELD PACK"
const symbol = "SHC"

describe("MarketPlace",()=>{
	let nftContract;
	let marketContract;
	let items = [];

	it("Deploy NFT", async ()=>{
		const factory = await ethers.getContractFactory("NFT");
		nftContract = await factory.deploy(name, symbol);
		const reciept = await nftContract.deployTransaction.wait()
	});

	it("Deploy MarketPlace", async ()=>{
		const factory = await ethers.getContractFactory("MarketPlace");
		marketContract = await factory.deploy(nftContract.address);
		const reciept = await marketContract.deployTransaction.wait();
	});


	it("CreateItem", async()=>{
		for(let i=0; i<5; i++){
			let data = await nftContract.mint(`${i}=>${i} Item`,`${i}cid${i*23}Product`);
			let reciept = await data.wait();
			items.push(reciept.events[1].args.itemId);
		}
		let total = await nftContract.totalSupply();
		expect(total).to.equal(items.length);
	});

	it("sell at Market", async()=>{
		let nftApproveResult = await nftContract.approve(marketContract.address, items[0]);
		let reciept  = await nftApproveResult.wait();
		expect(reciept.events[0].args.approved).to.equal(marketContract.address);
		let data = await marketContract.sellItem(items[0], 200);
		reciept = await data.wait();
		expect(reciept.events[0].args.productId).to.equal(items[0]);
	});

	it("sell 3 more at Market", async()=>{
		for(let i=0; i<3;i++){
			try{
				let nftApproveResult = await nftContract.approve(marketContract.address, items[i]);
				let reciept  = await nftApproveResult.wait();
				expect(reciept.events[0].args.approved).to.equal(marketContract.address);
				let data = await marketContract.sellItem(items[i], 200);
				reciept = await data.wait();
				expect(reciept.events[0].args.productId).to.equal(items[i]);
			}
			catch(e){
				console.log(`Error occured in productId=>${items[i]} :`, e.reason);
			}
		}
		// expect(total).to.equal(items.length);
	});

	it("get Product Info", async ()=>{
		let product = await marketContract.productInfo(items[0]);
		expect(product.price).to.equal(200);
	});

	it("change Product Price", async ()=>{
		let result = await marketContract.changePrice(items[1],150);
		await result.wait();

		let product = await marketContract.productInfo(items[1]);
		expect(product.price).to.equal(150);
	});

	it("change Product Price", async ()=>{
		let result = await marketContract.changePrice(items[1],150);
		await result.wait();

		let product = await marketContract.productInfo(items[1]);
		expect(product.price).to.equal(150);
	});

	it("Buy Produt 1", async ()=>{
		let [seller,buyer] = await ethers.getSigners();
		let buyMarket = await marketContract.connect(buyer);
		expect(await nftContract.ownerOf(items[1])).to.equal(seller.address);
		let buyProp = await buyMarket.productInfo(items[1]);

		let result = await buyMarket.purchaseItem(items[1],{value:buyProp.price});
		let reciept = await result.wait();
		let args = reciept.events[2].args;
		console.log(args)
		expect(args.buyer).to.equal(buyer.address);
		expect(args.seller).to.equal(seller.address);
		expect(args.productId).to.equal(items[1]);

		//confirm purchase
		buyProp = await buyMarket.productInfo(items[1]);
		expect(buyProp.forSale).to.be.false;
		expect(await nftContract.ownerOf(items[1])).to.equal(buyer.address);

		result = await nftContract.getApproved(items[1]);
		expect(Number(result)).to.equal(0);

		//contract balance
		expect(await marketContract.totalInterest()).to.equal(50);
	});

	it("Withdraw coin", async ()=>{
		let seller = await ethers.getSigner();
		let initialBalance = await seller.getBalance();
		console.log("Seller initial Balance is =>", initialBalance);
		let result = await marketContract.withdraw();
		let reciept = await result.wait();
		console.log(result)
		console.log('--result');
		console.log(reciept);
		expect(reciept.events[0].args.keeper).to.equal(seller.address);
		expect(reciept.events[0].args.interest).to.equal(50);

		let finalBalance = await seller.getBalance();
		console.log("Seller final Balance is =>", finalBalance);
		console.log(initialBalance - finalBalance);
		expect(Number(initialBalance - finalBalance - reciept.gasUsed * reciept.effectiveGasPrice )).to.equal(50);
	})

})