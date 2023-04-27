require("@nomicfoundation/hardhat-toolbox");


module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.7.6",
        settings: {
          evmVersion: "istanbul",
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        },
      },
    ],
  },
  networks: {
    hardhat: {
      forking: {
        url: "https://eth-mainnet.alchemyapi.io/v2/db3BCFYSHgpg1hiuWyFjw1vdGNADl0zj",
      },
    },
  }
};
