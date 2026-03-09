const { ethers } = require("ethers");

async function main() {
    const provider = new ethers.JsonRpcProvider("https://api.avax.network/ext/bc/C/rpc");
    const gbuAddress = "0x1CE7d0BBB25008f2b6b7A1Cdc0c5A9BB7eDAb96D".toLowerCase();
    const ownerAddress = "0x6c18C4ba7E3b4574dd70e2C2A81B0a18321d039f".toLowerCase();
    const poolAddress = "0x98d488f7c9e78262779f067d584323630f516806".toLowerCase();
    const routerAddress = "0x60ae616a2a411368220172c3f86b110ee1f7d5f1";

    const abi = [
        "function balanceOf(address owner) view returns (uint256)",
        "function symbol() view returns (string)"
    ];

    const gbu = new ethers.Contract(gbuAddress, abi, provider);

    try {
        const ownerBal = await gbu.balanceOf(ownerAddress);
        const contractBal = await gbu.balanceOf(gbuAddress);
        const poolBal = await gbu.balanceOf(poolAddress);

        console.log("=== GBU On-Chain Investigation ===");
        console.log("Token Symbol:", await gbu.symbol());
        console.log("1. Your Wallet (0x6c18...):", ethers.formatUnits(ownerBal, 18), "GBU");
        console.log("2. Token Identity (0x1CE...):", ethers.formatUnits(contractBal, 18), "GBU (Always 0 because it is the CODE)");
        console.log("3. Liquidity Pool (0x98D...):", ethers.formatUnits(poolBal, 18), "GBU (Available for trading)");
        console.log("====================================");
    } catch (e) {
        console.error("Investigation failed:", e.message);
    }
}

main();
