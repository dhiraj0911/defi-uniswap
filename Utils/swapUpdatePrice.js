import { AlphaRouter } from "@uniswap/smart-order-router";
import { ethers } from 'ethers';
console.log(ethers.parseUnits);
import {Token, CurrencyAmount, Trade, Route, TradeType, Percent} from "@uniswap/sdk-core";
import BigNumber from "big-number/big-number";

const V3_SWAP_ROUTER_ADDRESS = "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45";

const chainId = 1;

const provider = new ethers.providers.JsonRpcProvider(
    "https://eth-mainnet.alchemyapi.io/v2/db3BCFYSHgpg1hiuWyFjw1vdGNADl0zj"
);

const router = new AlphaRouter({chainId: chainId, provider: provider});

const name0 = "Wrapped Ether";
const symbol0 = "WETH";
const decimals0 = 18;
const address0 = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";

const name1 = "DAI";
const symbol1 = "DAI";
const decimals1 = 18;
const address1 = "0x6B175474E89094C44Da98b954EedeAC495271d0F";

const WETH = new Token(chainId, address0, decimals0, symbol0, name0);
const DAI = new Token(chainId, address1, decimals1, symbol1, name1);

export const swapUpdatePrice = async (
    inputAmount,
    slippageAmount,
    deadline,
    walletAddress,
) => {
    const percentSlippage = new Percent(slippageAmount, 100);
    // console.log(ethers);
    const wei = ethers.parseUnits(inputAmount, decimals0);
    const currencyAmount = CurrencyAmount.fromRawAmount(
        WETH,
        BigNumber.from(wei)
    );
    
    const route = await router.route(currencyAmount, DAI, TradeType.EXACT_INPUT, {
        recipient: walletAddress,
        slippageTolerance: percentSlippage,
        deadline: deadline, 
    });

    const transaction = {
        data: route.methodParameters.calldata,
        to: V3_SWAP_ROUTER_ADDRESS,
        value: BigNumber.from(route.methodParameters.value),
        from: walletAddress,
        gasPrice: BigNumber.from(route.gasPriceWei),
        gasLimit: ethers.utils.hexlify(1000000),
    }
    const quoteAmountOut = route.quote.toFixed(6);
    const ratio = (inputAmount / quoteAmountOut).toFixed(3);

    console.log(quoteAmountOut, ratio);
    return [transaction, quoteAmountOut, ratio];
}
