const { ethers } = require("ethers");

async function main() {
    const provider = new ethers.JsonRpcProvider("https://api.avax.network/ext/bc/C/rpc");
    const nftAddress = "0xeAD975dA58aF3828238E2c88d2683fabc3A4d277";
    const ownerAddress = "0x6c18C4ba7E3b4574dd70e2C2A81B0a18321d039f";

    const abi = [
        "function balanceOf(address owner) view returns (uint256)",
        "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
        "function tokenURI(uint256 tokenId) view returns (string)",
        "function name() view returns (string)"
    ];

    const nft = new ethers.Contract(nftAddress, abi, provider);

    try {
        const name = await nft.name();
        const balance = await nft.balanceOf(ownerAddress);

        console.log(`NFT Collection: ${name}`);
        console.log(`Your balance: ${balance.toString()} NFTs`);

        for (let i = 0; i < balance; i++) {
            // Some ERC721 don't have tokenOfOwnerByIndex, but we used standard storage usually.
            // Let's try to just check IDs 0, 1, 2 which we minted.
            try {
                const uri = await nft.tokenURI(i);
                console.log(`- Token ID ${i}: ${uri}`);
            } catch (e) {
                console.log(`- Token ID ${i}: (Could not fetch URI)`);
            }
        }
    } catch (e) {
        console.error("Error fetching NFT data:", e.message);
    }
}

main();
