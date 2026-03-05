const { ethers } = require("ethers");

async function main() {
    const provider = new ethers.JsonRpcProvider("https://api.avax.network/ext/bc/C/rpc");
    
    const GBU_ADDRESS = "0x1CE7d0BBB25008f2b6b7A1Cdc0c5A9BB7eDAb96D";
    const WAVAX_ADDRESS = "0xB31f66AA3C1e785363F022A1EF71E39D89730a56";
    const FACTORY_ADDRESS = "0x9Ad6C38BE94206cA50bb0d90783181699d037C6b"; // TraderJoe V2 Factory

    const factoryAbi = ["function getPair(address tokenA, address tokenB) view returns (address pair)"];
    const factory = new ethers.Contract(FACTORY_ADDRESS, factoryAbi, provider);

    const pairAddress = await factory.getPair(GBU_ADDRESS, WAVAX_ADDRESS);
    console.log("Liquidity Pair Address:", pairAddress);

    if (pairAddress === "0x0000000000000000000000000000000000000000") {
        console.log("No pair found on V2 factory. Checking V1/Other...");
        return;
    }

    const pairAbi = [
        "function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
        "function token0() view returns (address)",
        "function token1() view returns (address)"
    ];
    const pair = new ethers.Contract(pairAddress, pairAbi, provider);

    const reserves = await pair.getReserves();
    const token0 = await pair.token0();
    
    let gbuRes, avaxRes;
    if (token0.toLowerCase() === GBU_ADDRESS.toLowerCase()) {
        gbuRes = reserves.reserve0;
        avaxRes = reserves.reserve1;
    } else {
        gbuRes = reserves.reserve1;
        avaxRes = reserves.reserve0;
    }

    console.log("--- POOL RESERVES ---");
    console.log("GBU in pool:", ethers.formatUnits(gbuRes, 18));
    console.log("AVAX in pool:", ethers.formatUnits(avaxRes, 18));
    
    const priceInAvax = Number(avaxRes) / Number(gbuRes);
    console.log("Price (GBU/AVAX):", priceInAvax.toFixed(8));
    
    // Получим цену AVAX еще раз, чтобы перепроверить тот странный результат
    const priceFeedAddress = "0x0A77230d17318075983913bC2145DB16C7366156";
    const aggregatorAbi = ["function latestRoundData() view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)"];
    const priceFeed = new ethers.Contract(priceFeedAddress, aggregatorAbi, provider);
    const roundData = await priceFeed.latestRoundData();
    const avaxUsd = Number(roundData.answer) / 10**8;
    
    console.log("AVAX Price (USD):", avaxUsd.toFixed(2));
    console.log("GBU Price (USD):", (priceInAvax * avaxUsd).toFixed(4));
}

main().catch(console.error);
