const { ethers } = require("ethers");

async function main() {
    const provider = new ethers.JsonRpcProvider("https://api.avax.network/ext/bc/C/rpc");
    const gbuAddress = "0x1CE7d0BBB25008f2b6b7A1Cdc0c5A9BB7eDAb96D".toLowerCase();
    const wavaxAddress = "0xb31f66aa3c1e785363f022a1ef71e39d89730a56".toLowerCase();

    // TraderJoe V1 Factory
    const v1FactoryAddress = "0x9ad6c38be942021a0171c0686c605d8d10117c73";
    const v1Abi = ["function getPair(address,address) view returns (address)"];
    const v1Factory = new ethers.Contract(v1FactoryAddress, v1Abi, provider);

    // TraderJoe V2.1 LBFactory
    const v21FactoryAddress = "0x8e42f2F4101563bF679975178e880FD87d3eFd4e";
    const v21Abi = ["function getLBPairInformation(address,address,uint256) view returns (uint16,address,bool)"];
    const v21Factory = new ethers.Contract(v21FactoryAddress, v21Abi, provider);

    console.log("Checking TraderJoe V1...");
    try {
        const v1Pair = await v1Factory.getPair(gbuAddress, wavaxAddress);
        console.log("V1 Pair:", v1Pair);
    } catch (e) {
        console.log("V1 Check failed:", e.message);
    }

    console.log("Checking TraderJoe V2.1 (Bin 20)...");
    try {
        // Checking common bin step 20 (standard for AVAX/Tokens)
        const info = await v21Factory.getLBPairInformation(gbuAddress, wavaxAddress, 20);
        console.log("V2.1 Pair (Bin 20):", info[1]);
    } catch (e) {
        console.log("V2.1 Check failed:", e.message);
    }
}

main();
