const { ethers } = require("ethers");

async function main() {
    const provider = new ethers.JsonRpcProvider("https://api.avax.network/ext/bc/C/rpc");
    const nftAddress = "0xeAD975dA58aF3828238E2c88d2683fabc3A4d277";
    const ownerAddress = "0x6c18C4ba7E3b4574dd70e2C2A81B0a18321d039f";

    const abi = [
        "function balanceOf(address owner) view returns (uint256)",
        "function name() view returns (string)",
        "function symbol() view returns (string)"
    ];

    const nft = new ethers.Contract(nftAddress, abi, provider);

    try {
        const name = await nft.name();
        const symbol = await nft.symbol();
        const balance = await nft.balanceOf(ownerAddress);
        
        console.log(`NFT Collection: ${name} (${symbol})`);
        console.log(`Address: ${nftAddress}`);
        console.log(`Your balance: ${balance.toString()} NFTs`);
    } catch (e) {
        console.error("Error fetching NFT data:", e.message);
    }
}

main();
