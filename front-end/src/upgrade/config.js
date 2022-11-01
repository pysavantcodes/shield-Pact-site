import extraOption from '../addressConfig';

const config = {
  baseIPFSURI:'https://nftstorage.link/ipfs/',
  baseURI:'https://nftstorage.link/ipfs/',
  explorer:(extraOption.production?'https://testnet.bscscan.com/tx/':'https://bscscan.com/tx/'),
  busdAddress:(extraOption.production?'0xe9e7cea3dedca5984780bafc599bd69add087d56':'0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee'),
  routerAddress:(extraOption.production?"0x10ed43c718714eb63d5aa57b78b54704e256024e":"0x9ac64cc6e4415144c455bd8e4837fea55603e5c3"),
  ...extraOption
}

 

/*const extraOption = {
  PROJECTID:'5f0a0c1eda156a9eade6dfcf6dbc0cea',
  NFT_STORAGE_KEY:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDEyQjhiNzkxQzkxMDNlMUNEMDU0RWU0Nzc5MkQ2NDY3OTQ0YjFkYTUiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2NTA0MTIzNTQwMywibmFtZSI6IlNISUVMRENPSU4ifQ.bBacconKCT3IaZkLAUPpss7BIdZBjcU0QTIvqRHS9XQ',
  busdAddress:'0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee',
  admin:'0x712196554d705f00396b9cB7D8384D225E92DF1b',
  launchFactoryAddress:"0xf9e6E7E11514e3BEA47873EE6202598D2cB47fcB",
  nftAddress:"0x9df5A067273096A4fa38CFF9dB33161355Cb6154",
  marketAddress:"0x57EB5a1AcaC54071062aF2289945954cb12C8a84",
  stakeAddr:"0x6f2326E0cB5def734Cee56fbFb9401D1F982447C",
  bonusTokenAddress:"0xF570EFf7f847B09D1119B9a80590F10e6f458b96",
  airDropAddress:"0x2F0dD0492B0D3d0dc694d7BbA491C7d9aBA8fE18",
  tokenFactoryAddress:"0x0AED08168aE1Aa0E363877D34BD7b094Bc7e4f0b",
  swapAddress:"0xd2c95dD3709BB4531cEE0C8C3EDE3819f6505974",
  routerAddress:"0x10ED43C718714eb63d5aA57B78B54704E256024E",
  tokenServerAddress:"https://webserver-nine.vercel.app/",//deployed webserver address here
  production:false
}*/


