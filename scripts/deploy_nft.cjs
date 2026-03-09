const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying GbuNft with account:", deployer.address);

    // Deploy
    const GbuNft = await ethers.getContractFactory("GbuNft");
    const nft = await GbuNft.deploy(deployer.address);

    await nft.waitForDeployment();

    console.log("GbuNft deployed to:", await nft.getAddress());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
