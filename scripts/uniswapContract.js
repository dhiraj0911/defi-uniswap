const { Contract, ContractFactory, utils, BigNumber } = require("ethers");
const WETH9 = require('../Context/WETH9.json');

const artifacts = {
    UniswapV3Factory: require("@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json"),
    SwapRouter: require("@uniswap/v3-periphery/artifacts/contracts/SwapRouter.sol/SwapRouter.json"),
    NFTDescriptor: require("@uniswap/v3-periphery/artifacts/contracts/libraries/NFTDescriptor.sol/NFTDescriptor.json"),
    NonfungibleTokenPositionDescriptor: require("@uniswap/v3-periphery/artifacts/contracts/NonfungibleTokenPositionDescriptor.sol/NonfungibleTokenPositionDescriptor.json"),
    NonfungiblePositionManager: require("@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json"),
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
            });
        });
    });
    return bytecode;
};

async function main() {
    const [owner] = await ethers.getSigners();

    Weth = new ContractFactory(
        artifacts.WETH9.abi, 
        artifacts.WETH9.bytecode, 
        owner
    );
    weth = await Weth.deploy();

    console.log('wethAddress', `${weth.address}`);

    Factory = new ContractFactory(
        artifacts.UniswapV3Factory.abi,
        artifacts.UniswapV3Factory.bytecode,
        owner
    );
    factory = await Factory.deploy();

    console.log('factoryAddress', `${factory.address}`);



    SwapRouter = new ContractFactory(
        artifacts.SwapRouter.abi,
        artifacts.SwapRouter.bytecode,
        owner
    );
    swapRouter = await SwapRouter.deploy(factory.address, weth.address);

    console.log('swapRouterAddress', `${swapRouter.address}`);



    NFTDescriptor = new ContractFactory(
        artifacts.NFTDescriptor.abi,
        artifacts.NFTDescriptor.bytecode,
        owner
    );
    nftDescriptor = await NFTDescriptor.deploy();

    console.log('nftDescriptorAddress', `${nftDescriptor.address}`);



    const linkedBytecode = linkLibraries(
        {
            bytecode: artifacts.NonfungibleTokenPositionDescriptor.bytecode,
            linkReferences: {
                "NFTDescriptor.sol": {
                    NFTDescriptor: [ 
                        {
                            length: 20,
                            start: 1261
                        },
                    ],
                },
            },
        },
        {
            NFTDescriptor: nftDescriptor.address,
        }
    );

    NonfungibleTokenPositionDescriptor = new ContractFactory(
        artifacts.NonfungibleTokenPositionDescriptor.abi,
        linkedBytecode,
        owner
    );
    nonfungibleTokenPositionDescriptor = await NonfungibleTokenPositionDescriptor.deploy(weth.address);

    console.log('nonfungibleTokenPositionDescriptorAddress', `${nonfungibleTokenPositionDescriptor.address}`);


    NonfungiblePositionManager = new ContractFactory(
        artifacts.NonfungiblePositionManager.abi,
        artifacts.NonfungiblePositionManager.bytecode,
        owner
    );
    nonfungiblePositionManager = await NonfungiblePositionManager.deploy(factory.address, weth.address, nonfungibleTokenPositionDescriptor.address);
    
    
    // console.log('wethAddress', `${weth.address}`);
    // console.log('factoryAddress', `${factory.address}`);
    // console.log('swapRouterAddress', `${swapRouter.address}`);
    // console.log('nftDescriptorAddress', `${nftDescriptor.address}`);
    // console.log('nonfungibleTokenPositionDescriptorAddress', `${nonfungibleTokenPositionDescriptor.address}`);
    console.log('nonfungiblePositionManagerAddress', `${nonfungiblePositionManager.address}`);
}




// async function main() {
//     const [signer] = await ethers.getSigners();
//     const weth9 = await new ContractFactory(
//       WETH9.abi,
//       WETH9.bytecode,
//       signer
//     ).deploy();
//     console.log('wethAddress', `${weth9.address}`);

  
//     const uniswapV3Factory = await new ContractFactory(
//       artifacts.UniswapV3Factory.abi,
//       artifacts.UniswapV3Factory.bytecode,
//       signer
//     ).deploy();
//     console.log('uniswapV3Factory', `${uniswapV3Factory.address}`);

  
//     const swapRouter = await new ContractFactory(
//       artifacts.SwapRouter.abi,
//       artifacts.SwapRouter.bytecode,
//       signer
//     ).deploy(uniswapV3Factory.address, weth9.address);
//     console.log('swapRouter', `${swapRouter.address}`);

  
//     const nftDescriptorLibrary = await new ContractFactory(
//       artifacts.NFTDescriptor.abi,
//       artifacts.NFTDescriptor.bytecode,
//       signer
//     ).deploy();
//     console.log('nftDescriptorLibrary', `${nftDescriptorLibrary.address}`);

  
//     const nonfungibleTokenPositionDescriptor = await new ContractFactory(
//       artifacts.NonfungibleTokenPositionDescriptor.abi,
//       artifacts.NonfungibleTokenPositionDescriptor.bytecode,
//       signer
//     ).deploy(nftDescriptorLibrary.address, weth9.address);
//     console.log('nonfungibleTokenPositionDescriptor', `${nonfungibleTokenPositionDescriptor.address}`);

  
//     const nonfungiblePositionManager = await new ContractFactory(
//       artifacts.NonfungiblePositionManager.abi,
//       artifacts.NonfungiblePositionManager.bytecode,
//       signer
//     ).deploy(
//       uniswapV3Factory.address,
//       weth9.address,
//       nonfungibleTokenPositionDescriptor.address
//     );
//     console.log('nonfungiblePositionManager', `${nonfungiblePositionManager.address}`);
  
    // return {
    //   weth9,
    //   uniswapV3Factory,
    //   swapRouter,
    //   nftDescriptorLibrary,
    //   nonfungibleTokenPositionDescriptor,
    //   nonfungiblePositionManager
    // };

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }
);