import Web3Modal from "web3modal";
import { Contract, ethers } from "ethers";
import {Token} from "@uniswap/sdk-core";
import { Pool, Position, nearestUsableTick } from "@uniswap/v3-sdk";

//Uniswap contracts
const wethAddress = '0xb04CB6c52E73CF3e2753776030CE85a36549c9C2'
const factoryAddress = '0xc0c5618f0F3Fa66b496F2940f373DC366d765BAe'
const swapRouterAddress = '0xa195ACcEB1945163160CD5703Ed43E4f78176a54'
const nftDescriptorAddress = '0x6212cb549De37c25071cF506aB7E115D140D9e42'
const positionDescriptorAddress = '0x6F9679BdF5F180a139d01c598839a5df4860431b'
const positionManagerAddress = '0xf4AE7E15B1012edceD8103510eeB560a9343AFd3'

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