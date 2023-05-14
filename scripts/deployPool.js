//Token Addresses
dhirajAddress = '0x5E5713a0d915701F464DEbb66015adD62B2e6AE9'
rayyanAddress = '0x97fd63D049089cd70D9D139ccf9338c81372DE68' 
popUpAddress = '0xC0BF43A4Ca27e0976195E6661b099742f10507e5'  

//Uniswap contracts
factoryAddress =  '0x6212cb549De37c25071cF506aB7E115D140D9e42'
swapRouterAddress =  '0x6F9679BdF5F180a139d01c598839a5df4860431b'
nftDescriptorAddress =  '0xf4AE7E15B1012edceD8103510eeB560a9343AFd3'
positionDescriptorAddress =  '0x0bF7dE8d71820840063D4B8653Fd3F0618986faF'
positionManagerAddress =  '0xc981ec845488b8479539e6B22dc808Fb824dB00a'

const artifacts = {
    UniswapV3Factory: require('@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json'),
    NonfungiblePositionManager: require('@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json'),
};

const {Contract, BigNumber} = require('ethers');
const bn = require('bignumber.js');
bn.config({EXPONENTIAL_AT: 999999, DECIMAL_PLACES: 40});

const MAINNET_URL = "https://eth-mainnet.alchemyapi.io/v2/db3BCFYSHgpg1hiuWyFjw1vdGNADl0zj";

const provider = new ethers.providers.JsonRpcProvider(MAINNET_URL);

// const provider = waffle.provider;

function encodePriceSqrt(reserve1, reserve0) {
    return BigNumber.from(
        new bn(reserve1.toString())
          .div(reserve0.toString())
          .sqrt()
          .multipliedBy(new bn(2).pow(96))
          .integerValue(3)
          .toString()
    );
};

const nonfungiblePositionManager = new Contract(
    positionManagerAddress,
    artifacts.NonfungiblePositionManager.abi,
    provider,
);

const factory = new Contract(
    factoryAddress,
    artifacts.UniswapV3Factory.abi,
    provider
);

async function deployPool(token0, token1, fee, price) {
    const [owner] = await ethers.getSigners();
    await nonfungiblePositionManager
        .connect(owner)
        .createAndInitializePoolIfNecessary(token0, token1, fee, price, {
            gasLimit: 5000000,
        });
    const poolAddress = await factory
        .connect(owner)
        .getPool(token0, token1, fee);
    return poolAddress;
}

async function main() {
    const dhirRay = await deployPool(
        dhirajAddress,
        rayyanAddress,
        500,
        encodePriceSqrt(1, 1)
    );
    console.log('DHI_RAY = ', `"${dhirRay}"`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });