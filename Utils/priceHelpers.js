const axios = require('axios');

const ETHERSCAN_API_KEY = "5UPBS43AIM7D3IUW6C5PXPUKBJ1FKYYJA9";

exports.getAbi = async(address) => {
    // const url = `https://api.etherscan.io/api?module=contract&action=getabi&address=${address}&abikey=${ETHERSCAN_API_KEY}`;
    const url = `https://api.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=5UPBS43AIM7D3IUW6C5PXPUKBJ1FKYYJA9`
    const res = await axios.get(url);
    const [jsonString, errorMessage] = res.data.result.split('\n');
    const abi = JSON.parse(jsonString);
    console.log(errorMessage);
    return abi;
};

exports.getPoolImmutables = async(poolContract) => {
    const [token0, token1, fee] = await Promise.all([
        poolContract.token0(),
        poolContract.token1(),
        poolContract.fee()
    ])
    const immutables = {
        token0: token0,
        token1: token1,
        fee: fee
    }
    return immutables;
}