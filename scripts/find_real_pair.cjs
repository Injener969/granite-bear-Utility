const { ethers } = require("ethers");

async function main() {
    const provider = new ethers.JsonRpcProvider("https://api.avax.network/ext/bc/C/rpc");
    const factoryAddress = "0x9ad6c38be942021a0171c0686c605d8d10117c73".toLowerCase();
    const gbuAddress = "0x1CE7d0BBB25008f2b6b7A1Cdc0c5A9BB7eDAb96D".toLowerCase();
    const wavaxAddress = "0xb31f66aa3c1e785363f022a1ef71e39d89730a56".toLowerCase();

    const factoryAbi = ["function getPair(address,address) view returns (address)"];
    const factory = new ethers.Contract(factoryAddress, factoryAbi, provider);

    const pair = await factory.getPair(gbuAddress, wavaxAddress);
    console.log("Found Pair Address:", pair);
}

main();
