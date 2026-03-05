const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    // Deploying GraniteBearUtility
    const GBU = await hre.ethers.getContractFactory("GraniteBearUtility");
    const gbu = await GBU.deploy(deployer.address);

    await gbu.waitForDeployment();

    console.log("GBU Token deployed to:", await gbu.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
