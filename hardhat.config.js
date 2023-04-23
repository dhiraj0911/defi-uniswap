require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    forking: {
      url: "https://eth-goerli.g.alchemy.com/v2/GisqWtouBka7C7x7SPYCLXMzR0yvxJF3"
    },
    hardhat: {

    },
  }
};
