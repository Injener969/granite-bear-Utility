const axios = require('axios');
const { ethers } = require('ethers');

async function main() {
    const txHash = "0xaad7f6233f4f2241a3e2a05e8a43d723af617e877736b51cfe8441e0caeda070";
    const apiKey = "rs_4d795b5f937bb3e6bf42df60";

    // Using a different endpoint or querying just this tx
    // For now let's use the tx-specific call if possible or list token transfers
    const apiUrl = `https://api.routescan.io/v2/network/mainnet/evm/43114/etherscan/api?module=account&action=tokentx&address=0x6c18C4ba7E3b4574dd70e2C2A81B0a18321d039f&sort=desc&apikey=${apiKey}`;

    console.log(`Analyzing token transfers for wallet...`);
    try {
        const response = await axios.get(apiUrl);
        if (response.data.status === '1') {
            const txs = response.data.result;
            const relevantTx = txs.filter(t => t.hash === txHash);

            if (relevantTx.length > 0) {
                console.log(`\n--- Tokens Transferred in 0xaad7... ---`);
                for (const t of relevantTx) {
                    console.log(`Token: ${t.tokenName} (${t.tokenSymbol})`);
                    console.log(`Amount: ${ethers.formatUnits(t.value, t.tokenDecimal)}`);
                    console.log(`From: ${t.from}`);
                    console.log(`To: ${t.to}`);
                    console.log('-----------------------------------');
                }
            } else {
                console.log("\nNO GBU OR OTHER TOKENS MOVED IN THIS TRANSACTION HASH.");
            }
        }
    } catch (e) {
        console.error("Error:", e.message);
    }
}
main();
