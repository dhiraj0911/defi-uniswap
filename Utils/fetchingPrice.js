const {ethers}  = require('ethers');

const {
    abi: IUniswapV3PoolABI,
} = require('@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json');

const {
    abi: QuoterABI,
} = require('@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json');

const {getAbi, getPoolImmutables} = require('./priceHelpers');

const MAINNET_URL = "https://eth-mainnet.alchemyapi.io/v2/db3BCFYSHgpg1hiuWyFjw1vdGNADl0zj";

const provider = new ethers.providers.JsonRpcProvider(MAINNET_URL);

const qutorAddress = "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6";

export const getPrice = async(inputAmount, poolAddress) => {
    const poolContract = new ethers.Contract(
        poolAddress,
        IUniswapV3PoolABI,
        provider
    );
    // console.log(poolContract);
    const tokenAddress0 = await poolContract.token0();
    const tokenAddress1 = await poolContract.token1();

    console.log(tokenAddress0, tokenAddress1);

    const tokenAbi0 = getAbi(tokenAddress0);
    const tokenAbi1 = getAbi(tokenAddress1);

    const tokenContract0 = new ethers.Contract(tokenAddress0, tokenAbi0, provider);
    const tokenContract1 = new ethers.Contract(tokenAddress1, tokenAbi1, provider);

    const tokenSymbol0 = await tokenContract0.symbol();
    const tokenSymbol1 = await tokenContract1.symbol();

    const tokenDecimals0 = await tokenContract0.decimals();
    const tokenDecimals1 = await tokenContract1.decimals();
}