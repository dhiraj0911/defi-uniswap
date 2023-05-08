const { Contract, ContractFactory, utils, BigNumber } = require("ethers");
const WETH9 = require('../Context/WETH9.json');

const artifacts = {
    UniswapV3Factory: require("@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json"),
    SwapRouter: require("@uniswap/v3-periphery/artifacts/contracts/SwapRouter.sol/SwapRouter.json"),
    NFTDescriptor: require("@uniswap/v3-periphery/artifacts/contracts/libraries/NFTDescriptor.sol/NFTDescriptor.json"),
    NonfungibleTokenPositionDescriptor: require("@uniswap/v3-periphery/artifacts/contracts/NonfungibleTokenPositionDescriptor.sol/NonfungibleTokenPositionDescriptor.json"),
    WETH9
};

const linkLibraries = ({bytecode, linkReferences}, libraries) => {
    Object.keys(linkReferences).forEach((fileName) => {
        Object.keys(linkReferences[fileName]).forEach((contractName) => {
            if(!libraries.hasOwnProperty(contractName)) {
                throw new Error(`Missing link library name: ${contractName}`);
            }

            const address = utils
                .getAddress(libraries[contractName])
                .toLowerCase()
                .slice(2);

            linkReferences[fileName][contractName].forEach(({ start, length }) => {
                const start2 = 2 + start * 2;
                const length2 = length * 2;

                bytecode = bytecode
                    .slice(0, start2)
                    .concat(address)
                    .concat(bytecode.slice(start2 + length2, bytecode.length));
            })
        });
    })
}
