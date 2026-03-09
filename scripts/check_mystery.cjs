const { ethers } = require('ethers');

async function main() {
    const provider = new ethers.JsonRpcProvider("https://api.avax.network/ext/bc/C/rpc");
    const addr = "0x74b0e133Bee3384DFcFA60b31D85d8e2062De811";
    const code = await provider.getCode(addr);
    console.log(`Address: ${addr}`);
    console.log(`Code: ${code === '0x' ? 'EOA (Wallet)' : 'Contract'}`);

    // Check balance too
    const balance = await provider.getBalance(addr);
    console.log(`Balance: ${ethers.formatEther(balance)} AVAX`);
}
main();
