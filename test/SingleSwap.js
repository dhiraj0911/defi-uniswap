const { ethers } = require("hardhat");
const { expect } = require("chai");

const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const WETH9 = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

describe("SingleSwapToken", function () {  
  let swapExamples;
  let accounts;
  let weth;
  let dai;

  before(async () => {
    accounts = await ethers.getSigners();

    weth = await ethers.getContractAt("IWETH", WETH9);
    dai = await ethers.getContractAt("IERC20", DAI);

    const SwapExamples = await ethers.getContractFactory("SingleSwapToken");
    swapExamples = await SwapExamples.deploy();
    await swapExamples.deployed();
  })
  
  it("swapExactInputSingle", async function () {
    const amountIn = 10n ** 18n;
    
    await weth.connect(accounts[0]).deposit({ value: amountIn });
    await weth.connect(accounts[0]).approve(swapExamples.address, amountIn);

    await swapExamples.swapExactInputSingle(amountIn);

    console.log("DAI balance: ", await dai.balanceOf(accounts[0].address));
  });


  it("swapExactOutputSingle", async function () {
    const wethAmountInMax = 10n ** 18n;
    
    const daiAmountOut = 100n * 10n ** 18n;

    await weth.connect(accounts[0]).deposit({ value: wethAmountInMax });
    await weth.connect(accounts[0]).approve(swapExamples.address, wethAmountInMax);

    await swapExamples.swapExactOutputSingle(daiAmountOut, wethAmountInMax);

    console.log("DAI balance: ", await dai.balanceOf(accounts[0].address));
  });
});