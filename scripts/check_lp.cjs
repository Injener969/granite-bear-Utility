const { ethers } = require("hardhat");

async function main() {
    const GBU_ADDRESS = "0x1CE7d0BBB25008f2b6b7A1Cdc0c5A9BB7eDAb96D";
    const WAVAX_ADDRESS = "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7";
    const FACTORY_ADDRESS = "0x9Ad6C38BE94206cA50bb0d90783181662f0Cfa10";

    const factoryAbi = ["function getPair(address tokenA, address tokenB) external view returns (address pair)"];
    const erc20Abi = [
        "function balanceOf(address account) external view returns (uint256)",
        "function symbol() external view returns (string)",
        "function decimals() external view returns (uint8)"
    ];

    const [deployer] = await ethers.getSigners();
    const provider = deployer.provider;

    const factory = new ethers.Contract(FACTORY_ADDRESS, factoryAbi, provider);
    const pairAddress = await factory.getPair(WAVAX_ADDRESS, GBU_ADDRESS);

    console.log("-----------------------------------------");
    console.log("Trader Joe WAVAX-GBU Pair Address:", pairAddress);

    if (pairAddress === ethers.ZeroAddress) {
        console.log("❌ POOL DOES NOT EXIST!");
    } else {
        console.log("✅ POOL EXISTS AND IS LIVE!");
        const pairContract = new ethers.Contract(pairAddress, erc20Abi, provider);
        const symbol = await pairContract.symbol();
        const lpBalance = await pairContract.balanceOf(deployer.address);
        
        console.log("Your Wallet Address:", deployer.address);
        console.log(`Your LP Token Balance (${symbol}):`, ethers.formatEther(lpBalance));
    }
    console.log("-----------------------------------------");
}

main().catch(console.error);
