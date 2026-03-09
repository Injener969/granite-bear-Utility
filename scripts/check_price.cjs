const { ethers } = require("hardhat");

async function main() {
    const GBU_ADDRESS = "0x1CE7d0BBB25008f2b6b7A1Cdc0c5A9BB7eDAb96D";
    const WAVAX_ADDRESS = "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7";
    const PAIR_ADDRESS = "0x0eBf6BED53827236EA8391bd53b7341d8c9b5f22";

    const pairAbi = [
        "function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
        "function token0() external view returns (address)",
        "function token1() external view returns (address)"
    ];

    const provider = ethers.provider;
    const pair = new ethers.Contract(PAIR_ADDRESS, pairAbi, provider);

    const r = await pair.getReserves();
    const token0 = await pair.token0();
    
    let reserveWavax, reserveGbu;

    if (token0.toLowerCase() === WAVAX_ADDRESS.toLowerCase()) {
        reserveWavax = ethers.formatEther(r[0]);
        reserveGbu = ethers.formatEther(r[1]);
    } else {
        reserveWavax = ethers.formatEther(r[1]);
        reserveGbu = ethers.formatEther(r[0]);
    }

    console.log("=== TRADER JOE POOL STATUS ===");
    console.log("WAVAX inside pool:", reserveWavax);
    console.log("GBU inside pool:", reserveGbu);
    
    if (reserveWavax > 0 && reserveGbu > 0) {
        const priceInAvax = reserveWavax / reserveGbu;
        console.log(`Current Price: 1 GBU = ${priceInAvax.toFixed(6)} AVAX`);
        console.log(`(If AVAX=$35, this is ~$${(priceInAvax * 35).toFixed(4)})`);
    } else {
        console.log("❌ Pool is empty!");
    }
}

main().catch(console.error);
