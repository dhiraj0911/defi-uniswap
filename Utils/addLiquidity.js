import Web3Modal from "web3modal";
import { Contract, ethers } from "ethers";
import {Token} from "@uniswap/sdk-core";
import { Pool, Position, nearestUsableTick } from "@uniswap/v3-sdk";

//Uniswap contracts
// const wethAddress =  '0x021DBfF4A864Aa25c51F0ad2Cd73266Fde66199d'
// const factoryAddress =  '0x4CF4dd3f71B67a7622ac250f8b10d266Dc5aEbcE'
// const swapRouterAddress =  '0x2498e8059929e18e2a2cED4e32ef145fa2F4a744'
// const nftDescriptorAddress =  '0x447786d977Ea11Ad0600E193b2d07A06EfB53e5F'
// const positionDescriptorAddress =  '0x6DcBc91229d812910b54dF91b5c2b592572CD6B0'
const positionManagerAddress =  '0x5E5713a0d915701F464DEbb66015adD62B2e6AE9'

const artifacts = {
    NonfungiblePositionManager: require('@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json'),
    UniswapV3Pool: require('@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json'),
    WETH9: require("../Context/WETH9.json"),
}

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

export const addLiquidityExternal = async (
    tokenAddress1,
    tokenAddress2,
    poolAddress,
    poolFee,
    tokenAmount1,
    tokenAmount2,
) => {
    const web3modal =  await new Web3Modal();
    const connection =  await web3modal.connect();
    const provider = new ethers.providers.Web3Provider (connection);
    const signer = provider.getSigner();
    const accountAddress = await signer.getAddress();

    const token1Contract = new Contract(
        tokenAddress1,
        artifacts.WETH9.abi,
        provider
    );
    const token2Contract = new Contract(
        tokenAddress2,
        artifacts.WETH9.abi,
        provider
    );

    await token1Contract
        .connect(signer)
        .approve(
            positionManagerAddress,
            ethers.utils.parseEther(tokenAmount1.toString())
        )

    await token2Contract
        .connect(signer)
        .approve(
            positionManagerAddress,
            ethers.utils.parseEther(tokenAmount2.toString())
        )
    
    const poolContract = new Contract(
        poolAddress,
        artifacts.UniswapV3Pool.abi,
        provider
    );

    const {chainId} = await provider.getNetwork();
    
    //token1
    const token1Name = await token1Contract.name();
    const token1Symbol = await token1Contract.symbol();
    const token1Decimals = await token1Contract.decimals();
    const token1Address = await token1Contract.address;

    //token2
    const token2Name = await token2Contract.name();
    const token2Symbol = await token2Contract.symbol();
    const token2Decimals = await token2Contract.decimals();
    const token2Address = await token2Contract.address;

    const TokenA = new Token(
        chainId,
        token1Address,
        token1Decimals,
        token1Name,
        token1Symbol,
    );

    const TokenB = new Token(
        chainId,
        token2Address,
        token2Decimals,
        token2Name,
        token2Symbol,
    );

    const poolData = await getPoolData(poolContract);
    console.log(poolData);

    const pool = new Pool(
        TokenA,
        TokenB,
        poolData.fee,
        poolData.sqrtPriceX96.toString(),
        poolData.liquidity.toString(),
        poolData.tick,
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

    const params = {
        token0: tokenAddress1,
        token1: tokenAddress2,
        fee: poolData.fee,
        // fee: poolFee,
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
        recipient: accountAddress,
        deadline: Math.floor(Date.now() / 1000) + 60 * 10,
    };

    const nonfungiblePositionManager = new Contract(
        positionManagerAddress,
        artifacts.NonfungiblePositionManager.abi,
        signer,
    );

    const tx = await nonfungiblePositionManager.connect(signer).mint(params, {
        gasLimit: 1000000,
    });
    const receipt = await tx.wait();
    return receipt;
};