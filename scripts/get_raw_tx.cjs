const { ethers } = require('ethers');

async function main() {
    const provider = new ethers.JsonRpcProvider("https://api.avax.network/ext/bc/C/rpc");
    const txHash = "0xaad7f6233f4f2241a3e2a05e8a43d723af617e877736b51cfe8441e0caeda070";

    console.log(`Getting raw transaction data for ${txHash}...`);
    try {
        const tx = await provider.getTransaction(txHash);
        const receipt = await provider.getTransactionReceipt(txHash);

        console.log(`\nValue: ${ethers.formatEther(tx.value)} AVAX`);
        console.log(`To: ${tx.to}`);
        console.log(`Gas Used: ${receipt.gasUsed.toString()}`);
        console.log(`Input Data: ${tx.data}`);

        // Let's decode if it's TraderJoe Router
        // addLiquidityAVAX(address token, uint amountTokenDesired, uint amountTokenMin, uint amountETHMin, address to, uint deadline)
        // Router: 0x60aE616a2a411368220172C3f86B110EE1f7d5f1 (My previous address was slightly different?)

    } catch (e) {
        console.error("Error:", e.message);
    }
}
main();
