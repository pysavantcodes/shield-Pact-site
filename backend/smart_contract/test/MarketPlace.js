const { expect } = require("chai");

const name = "SHIELD PACK"
const symbol = "SHC"
const fee = 500;
describe("MarketPlace",()=>{
	let nftContract;
	let marketContract;
	let items = [];
	let seller,buyer;

	before(async ()=>{
		[seller,buyer] = await ethers.getSigners();
	})

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
			let data = await nftContract.mint(`${i}cid${i*23}Product`);
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
		let price = ethers.utils.parseEther('2.00');
		let data = await marketContract.sellItem(items[0], price);
		reciept = await data.wait();
		expect(reciept.events[0].args.productId).to.equal(items[0]);
	});

	it("sell 3 more at Market", async()=>{
		let price = ethers.utils.parseEther('30.0');
		for(let i=0; i<4;i++){
			try{
				let nftApproveResult = await nftContract.approve(marketContract.address, items[i]);
				let reciept  = await nftApproveResult.wait();
				expect(reciept.events[0].args.approved).to.equal(marketContract.address);
				let data = await marketContract.sellItem(items[i], price);
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
		let price = ethers.utils.parseEther('2.00');
		let product = await marketContract.productInfo(items[0]);
		expect(product.price).to.equal(price);
	});

	it("change Product Price", async ()=>{
		let price = ethers.utils.parseEther('50.00');
		let result = await marketContract.changePrice(items[1],price);
		await result.wait();

		let product = await marketContract.productInfo(items[1]);
		expect(product.price).to.equal(price);
	});

	it("Buy Produt 1", async ()=>{
		let buyMarket = await marketContract.connect(buyer);
		expect(await nftContract.ownerOf(items[1])).to.equal(seller.address);
		for(let i=0; i<4;i++){
			let buyProp = await buyMarket.productInfo(items[i]);
			console.log("Initial Balance=>", await seller.getBalance())
			let result = await buyMarket.purchaseItem(items[i],{value:buyProp.price});
			let reciept = await result.wait();
			let args = reciept.events[2].args;
			console.log("Final Balance=>", await seller.getBalance())
			console.log(args)
			expect(args.buyer).to.equal(buyer.address);
			expect(args.seller).to.equal(seller.address);
			expect(args.productId).to.equal(items[i]);

			//confirm purchase
			buyProp = await buyMarket.productInfo(items[i]);
			expect(buyProp.forSale).to.be.false;
			expect(await nftContract.ownerOf(items[i])).to.equal(buyer.address);

			result = await nftContract.getApproved(items[i]);
			expect(Number(result)).to.equal(0);
		}
		//contract balance
		expect(await marketContract.totalInterest()).to.equal(fee*4);
	});

	it("Withdraw coin", async ()=>{
		let price = ethers.utils.parseEther('5.00');
		
		let result = await marketContract.withdraw();
		let reciept = await result.wait();
		console.log("Profit Balance=>", await seller.getBalance())
		expect(reciept.events[0].args.keeper).to.equal(seller.address);
		expect(reciept.events[0].args.interest).to.equal(fee*4);
		expect(await marketContract.totalInterest()).to.equal(0);
	})

})