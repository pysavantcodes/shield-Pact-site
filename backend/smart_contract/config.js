require('dotenv').config();

const config = {
	admin:process.env.ADMIN,
	NFT_NAME:process.env.NFT_NAME,
	NFT_SYMBOL:process.env.NFT_SYMBOL,
	adminToken:process.env.PRODUCTION?process.env.ADMIN_TOKEN:"0x542eD1F83870a6Adcf484e9c9888f04D539e0A00",
  busdAddress:(process.env.PRODUCTION?'0xe9e7cea3dedca5984780bafc599bd69add087d56':'0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee'),
  routerAddress:(process.env.PRODUCTION?"0x10ed43c718714eb63d5aa57b78b54704e256024e":"0xD99D1c33F9fC3444f8101754aBC46c52416550D1"),
  wbnb:(process.env.PRODUCTION?"0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c":"0x094616F0BdFB0b526bD735Bf66Eca0Ad254ca81F"),
  production:process.env.PRODUCTION
}

module.exports = config;