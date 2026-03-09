const { ethers } = require("hardhat");

async function main() {
    const gbuAddress = "0x1CE7d0BBB25008f2b6b7A1Cdc0c5A9BB7eDAb96D";
    const usdtAddress = "0x9702230a2441d44697590d48a91ed59151cf59c5"; // Fixed checksum case

    const avaxRate = 905; // 1 AVAX = 905 GBU (approx $9.05/AVAX -> $0.01/GBU)
    const usdtRate = 100; // 1 USDT = 100 GBU ($0.01/GBU)

    const [deployer] = await ethers.getSigners();
    console.log("Deploying Sale contract with the account:", deployer.address);

    const GbuSale = await ethers.getContractFactory("GbuSale");
    const sale = await GbuSale.deploy(gbuAddress, usdtAddress, avaxRate, usdtRate);

    await sale.waitForDeployment();
    const address = await sale.getAddress();

    console.log("GbuSale contract deployed to:", address);
    console.log("Rates updated for current market: 1 AVAX =", avaxRate, "GBU | 1 USDT =", usdtRate, "GBU");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
