const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying GraniteBearClub with account:", deployer.address);

    const baseURI = "ipfs://bafybeih6skdiu2tzwa3kidig2chtik7lg532vd7aw6o2wmkmwcclu64ekq/";

    const GraniteBearClub = await ethers.getContractFactory("GraniteBearClub");
    const nft = await GraniteBearClub.deploy(baseURI);

    await nft.waitForDeployment();
    const address = await nft.getAddress();
    console.log("GraniteBearClub deployed to:", address);

    console.log("Minting first 3 NFTs (Gold, Silver, Bronze) to deployer...");
    const tx = await nft.mintBatch(deployer.address, 3);
    await tx.wait();
    console.log("Successfully minted first 3 NFTs!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
