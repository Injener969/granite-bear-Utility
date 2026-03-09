const { ethers } = require("hardhat");

async function main() {
    const GBU_ADDRESS = "0x1CE7d0BBB25008f2b6b7A1Cdc0c5A9BB7eDAb96D";
    const JOE_ROUTER_ADDRESS = "0x60aE616a2155Ee3d9A68541Ba4544862310933d4"; // TraderJoe V1 Router

    const gbuAmount = ethers.parseUnits("150", 18);
    const avaxAmount = ethers.parseEther("1.0");

    const [deployer] = await ethers.getSigners();
    console.log("Using account:", deployer.address);

    const balanceBefore = await ethers.provider.getBalance(deployer.address);
    console.log("AVAX Balance:", ethers.formatEther(balanceBefore));

    if (balanceBefore < avaxAmount) {
        throw new Error("Not enough AVAX to provide liquidity + gas");
    }

    // 1. Approve GBU for Router
    const gbuAbi = [
        "function approve(address spender, uint256 amount) public returns (bool)",
        "function balanceOf(address account) public view returns (uint256)"
    ];
    const gbuContract = new ethers.Contract(GBU_ADDRESS, gbuAbi, deployer);

    const gbuBal = await gbuContract.balanceOf(deployer.address);
    console.log("GBU Balance:", ethers.formatUnits(gbuBal, 18));
    if (gbuBal < gbuAmount) {
        throw new Error("Not enough GBU to provide liquidity");
    }

    console.log("Approving Trader Joe Router to spend 150 GBU...");
    const approveTx = await gbuContract.approve(JOE_ROUTER_ADDRESS, gbuAmount);
    await approveTx.wait();
    console.log("Approved! Transaction Hash:", approveTx.hash);

    // 2. Add Liquidity
    const routerAbi = [
        "function addLiquidityAVAX(address token, uint amountTokenDesired, uint amountTokenMin, uint amountETHMin, address to, uint deadline) external payable returns (uint amountToken, uint amountETH, uint liquidity)"
    ];
    const router = new ethers.Contract(JOE_ROUTER_ADDRESS, routerAbi, deployer);

    const deadline = Math.floor(Date.now() / 1000) + 60 * 10; // 10 minutes from now

    console.log("Providing 1 AVAX + 150 GBU to the pool...");
    const tx = await router.addLiquidityAVAX(
        GBU_ADDRESS,
        gbuAmount,
        0, // amountTokenMin
        0, // amountETHMin
        deployer.address, // to
        deadline,
        { value: avaxAmount }
    );

    console.log("Transaction sent! Hash:", tx.hash);
    console.log("Waiting for confirmation...");
    await tx.wait();
    console.log("✅ Liquidity successfully added! TraderJoe pool created!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
