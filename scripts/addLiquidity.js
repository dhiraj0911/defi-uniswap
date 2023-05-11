//Token Addresses
dhirajAddress = '0x0bF7dE8d71820840063D4B8653Fd3F0618986faF'
rayyanAddress = '0xc981ec845488b8479539e6B22dc808Fb824dB00a'
popUpAddress = '0x5E5713a0d915701F464DEbb66015adD62B2e6AE9'

DHI_RAY =  "0x8EbEC61844c6Bc9336D63c276DfB7576c61b6c6b"

//Uniswap contracts
wethAddress =  '0xb04CB6c52E73CF3e2753776030CE85a36549c9C2'
factoryAddress =  '0xc0c5618f0F3Fa66b496F2940f373DC366d765BAe'
swapRouterAddress =  '0xa195ACcEB1945163160CD5703Ed43E4f78176a54'
nftDescriptorAddress =  '0x6212cb549De37c25071cF506aB7E115D140D9e42'
positionDescriptorAddress =  '0x6F9679BdF5F180a139d01c598839a5df4860431b'
positionManagerAddress =  '0xf4AE7E15B1012edceD8103510eeB560a9343AFd3'

const artifacts = {
    NonfungiblePositionManager: require('@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json'),
    Dhiraj: require('../artifacts/contracts/Dhiraj.sol/Dhiraj.json'),
    Rayyan: require('../artifacts/contracts/Rayyan.sol/Rayyna.json'),
    UniswapV3Pool: require('@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json'),
}

const { Contract } = require("ethers");
const { Token } = require("@uniswap/sdk-core");
const { Pool, Position, nearestUsableTick } = require("@uniswap/v3-sdk");

async function getPoolData(poolContract) {
    const [tickSpacing, fee, liquidity, slot0] = await Promise.all([
        poolContract.tickSpacing(),
        poolContract.fee(),
        poolContract.liquidity(),
        poolContract.slot0(),
    ]);

    return {
        tickSpacing: tickSpacing,
        fee: fee,
        liquidity: liquidity,
        sqrtPriceX96: slot0[0],
        tick: slot0[1],
    };
};

async function main() {
    const [owner, signer2] = await ethers.getSigners();
    const provider = waffle.provider;

    const DhirajContract = new Contract(
        dhirajAddress,
        artifacts.Dhiraj.abi,
        provider
    );
    const RayyanContract = new Contract(
        rayyanAddress,
        artifacts.Rayyan.abi,
        provider
    );

    await DhirajContract.connect(signer2).approve(
        positionManagerAddress,
        ethers.utils.parseEther("1000")
    );
    await RayyanContract.connect(signer2).approve(
        positionManagerAddress,
        ethers.utils.parseEther("1000")
    );

    const poolContract = new Contract(
        DHI_RAY,
        artifacts.UniswapV3Pool.abi,
        provider
    );

    const poolData = await getPoolData(poolContract);

    const DhirajToken = new Token(31337, dhirajAddress, 18, "Dhiraj", "BARI");
    const RayyanToken = new Token(31337, rayyanAddress, 18, "Rayyan", "Rayyanci");

    const pool = new Pool(
        DhirajToken,
        RayyanToken,
        poolData.fee,
        poolData.sqrtPriceX96.toString(),
        poolData.liquidity.toString(),
        poolData.tick   
    );

    const position = new Position({
        pool: pool,
        liquidity: ethers.utils.parseEther("1"),
        tickLower: 
            nearestUsableTick(poolData.tick, poolData.tickSpacing) - 
            poolData.tickSpacing * 2,
        tickUpper:
            nearestUsableTick(poolData.tick, poolData.tickSpacing) +
            poolData.tickSpacing * 2,
    });

    const {amount0: amount0Desired, amount1: amount1Desired} = position.mintAmounts;

    params = {
        token0: dhirajAddress,
        token1: rayyanAddress,
        fee: poolData.fee,
        tickLower:
            nearestUsableTick(poolData.tick, poolData.tickSpacing) -
            poolData.tickSpacing * 2,
        tickUpper:
            nearestUsableTick(poolData.tick, poolData.tickSpacing) +
            poolData.tickSpacing * 2,
        amount0Desired: amount0Desired.toString(),
        amount1Desired: amount1Desired.toString(),
        amount0Min: 0, 
        amount1Min: 0,
        recipient: signer2.address,
        deadline: Math.floor(Date.now() / 1000) + 60 + 10,            
    };
    const nonfungiblePositionManager = new Contract(
        positionManagerAddress,
        artifacts.NonfungiblePositionManager.abi,
        provider
    );
    const tx = await nonfungiblePositionManager
        .connect(signer2)
        .mint(params, {gasLimit: "1000000"});
    const receipt = await tx.wait();
    console.log(receipt);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });