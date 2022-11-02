/** @type import('hardhat/config').HardhatUserConfig */

require("@nomicfoundation/hardhat-toolbox");

require('dotenv').config();

module.exports = {
  networks: {
    hardhat: {
    },
     localhost: {
      url: "http://127.0.0.1:8545"
    },

    testnet: {
      url: "https://bsc-testnet.nodereal.io/v1/e9a36765eb8a40b9bd12e680a1fd2bc5",
      chainId:97,
      accounts:[process.env.WALLET_KEY]
    },

    mainnet: {
      url: "https://bsc-dataseed1.binance.org",
      chainId:56,
      accounts:[process.env.WALLET_KEY]
      //specify wallet private key
      //specify production=true at .env
    },
  },
  solidity: {
    version: "0.8.15",
    settings: {
      optimizer: {
        enabled: true,
        runs: 5
      }
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 40000
  }
}