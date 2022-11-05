const { expect } = require("chai");

const name = "SHIELD PACK"
const symbol = "SHC"
const fee = 500;
describe("MarketPlace",()=>{
	let nftContract;
	let marketContract;
	let tokenContract;
	let items = [];
	let seller,buyer;

	before(async ()=>{
		[seller,buyer] = await ethers.getSigners();
	})

	it("Deploy Token", async ()=>{
		const factory = await ethers.getContractFactory("Token");
		tokenContract = await factory.deploy(ethers.utils.parseEther('10000.0'));
		const reciept = await tokenContract.deployTransaction.wait();
		expect(ethers.utils.formatEther(await tokenContract.balanceOf(seller.address))).to.equal("10000.0")
	});

	it("Deploy NFT", async ()=>{
		const factory = await ethers.getContractFactory("NFT");
		nftContract = await factory.deploy(name, symbol);
		const reciept = await nftContract.deployTransaction.wait()
	});

	it("Deploy MarketPlace", async ()=>{
		const factory = await ethers.getContractFactory("MarketPlace");
		marketContract = await factory.deploy(nftContract.address, tokenContract.address);
		const reciept = await marketContract.deployTransaction.wait();
	});


	it("CreateItem", async()=>{
		for(let i=0; i<5; i++){
			let data = await nftContract.mint(`${i}cid${i*23}Product`);
			let reciept = await data.wait();
			items.push(reciept.events[1].args.itemId);
		}
		let total = await nftContract.totalSupply();
		let ownedItem = await nftContract.itemCreated();
		expect(ownedItem, "No saving").to.have.lengthOf(5);
		expect(ownedItem).to.have.deep.members(items);
		expect(total).to.equal(items.length);
	});

	it("sell at Market", async()=>{
		let nftApproveResult = await nftContract.approve(marketContract.address, items[0]);
		let reciept  = await nftApproveResult.wait();
		expect(reciept.events[0].args.approved).to.equal(marketContract.address);
		let price = ethers.utils.parseEther('100.00');
		let data = await marketContract.sellItem(items[0], price, true);
		reciept = await data.wait();
		expect(reciept.events[0].args.productId).to.equal(items[0]);
	});

	it("sell 3 more at Market", async()=>{
		let price = ethers.utils.parseEther('300.0');
		for(let i=0; i<4;i++){
			try{
				let nftApproveResult = await nftContract.approve(marketContract.address, items[i]);
				let reciept  = await nftApproveResult.wait();
				expect(reciept.events[0].args.approved).to.equal(marketContract.address);
				let data = await marketContract.sellItem(items[i], price, true);
				reciept = await data.wait();
				expect(reciept.events[0].args.productId).to.equal(items[i]);
			}
			catch(e){
				console.log(`Error occured in productId=>${items[i]} :`, e.reason);
			}
		}
	});

	it("get Product Info", async ()=>{
		let price = ethers.utils.parseEther('300.00');
		let product = await marketContract.productInfo(items[0]);
		expect(product.price).to.equal(price);
	});

	it("change Product Price", async ()=>{
		let price = ethers.utils.parseEther('500.00');
		let result = await marketContract.sellItem(items[3],price, false);
		await result.wait();

		let product = await marketContract.productInfo(items[3]);
		expect(product.price).to.equal(price);
	});

	it("Buy Produt 1", async ()=>{
		let buyMarket = await marketContract.connect(buyer);
		expect(await nftContract.ownerOf(items[1])).to.equal(seller.address);
		for(let i=0; i<2;i++){
			let buyProp = await buyMarket.productInfo(items[i]);
			
			let result = await buyMarket.purchaseItemBNB(items[i],{value:buyProp.price});
			let reciept = await result.wait();
			let args = reciept.events[2].args;
			
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
		expect(await marketContract.totalInterestBNB()).not.equal(0);
	});

	it("Withdraw BNB", async ()=>{
		let interest = await marketContract.totalInterestBNB();
		let result = await marketContract.withdrawBNB();
		let reciept = await result.wait();
		
		expect(reciept.events[reciept.events.length-1].args.keeper).to.equal(seller.address);
		expect(reciept.events[reciept.events.length-1].args.interest).to.equal(interest);
		expect(await marketContract.totalInterestBNB()).to.equal(0);
	})

	it("Market Size", async ()=>{
		let product20 = await marketContract.get20Products(0);
		let size = await marketContract.size();
		
		expect(product20).to.have.lengthOf(size);
	});

	it("Transfer Token to buyer", async ()=>{
		//transfer token to buyer from seller
		let value = ethers.utils.parseEther('1000')
		await tokenContract.transfer(buyer.address, value);
		expect(await tokenContract.balanceOf(buyer.address)).to.equal(value);
	});

	it("purchase item 3", async ()=>{
		let buyMarket = await marketContract.connect(buyer);
		let buyProp = await buyMarket.productInfo(items[3]);
		
		let buyerToken = await tokenContract.connect(buyer);
		await buyerToken.approve(buyMarket.address, buyProp.price);

		let result = await buyMarket.purchaseItemBUSD(items[3]);
		let reciept = await result.wait();
		let args = reciept.events[reciept.events.length-1].args;
		
		
		expect(args.buyer).to.equal(buyer.address);
		expect(args.seller).to.equal(seller.address);
		expect(args.productId).to.equal(items[3]);

		//confirm purchase
		buyProp = await buyMarket.productInfo(items[3]);
		expect(buyProp.forSale).to.be.false;
		expect(await nftContract.ownerOf(items[3])).to.equal(buyer.address);

		result = await nftContract.getApproved(items[3]);
		expect(Number(result)).to.equal(0);
	});

	it("Withdraw BUSD", async ()=>{
		let interest = await marketContract.totalInterestBUSD();
		
		let result = await marketContract.withdrawBUSD();
		let reciept = await result.wait();
		
		expect(reciept.events[reciept.events.length-1].args.keeper).to.equal(seller.address);
		expect(reciept.events[reciept.events.length-1].args.interest).to.equal(interest);
		
		expect(await marketContract.totalInterestBNB()).to.equal(0);
	});

})