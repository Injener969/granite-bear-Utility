const axios = require('axios');
const { ethers } = require('ethers');

async function main() {
    const ownerAddress = "0x6c18C4ba7E3b4574dd70e2C2A81B0a18321d039f";
    const mysteryAddress = "0x74b0e133Bee3384DFcFA60b31D85d8e2062De811".toLowerCase();
    const apiKey = "rs_4d795b5f937bb3e6bf42df60";
    const apiUrl = `https://api.routescan.io/v2/network/mainnet/evm/43114/etherscan/api?module=account&action=txlist&address=${ownerAddress}&sort=desc&apikey=${apiKey}`;

    console.log(`Checking interactions with ${mysteryAddress}...`);
    try {
        const response = await axios.get(apiUrl);
        if (response.data.status === '1') {
            const txs = response.data.result;
            const interactions = txs.filter(t => t.to.toLowerCase() === mysteryAddress || t.from.toLowerCase() === mysteryAddress);

            if (interactions.length > 0) {
                console.log(`Found ${interactions.length} interactions:`);
                for (const tx of interactions) {
                    const timeStr = new Date(parseInt(tx.timeStamp) * 1000).toLocaleString();
                    console.log(`[${timeStr}] Hash: ${tx.hash}`);
                    console.log(`    From: ${tx.from}`);
                    console.log(`    To: ${tx.to}`);
                    console.log(`    Value: ${ethers.formatEther(tx.value)} AVAX`);
                    console.log(`    Method: ${tx.functionName || 'N/A'}`);
                    console.log('-----------------------------------');
                }
            } else {
                console.log("No direct interactions found in recent history.");
            }
        }
    } catch (e) {
        console.error("Error:", e.message);
    }
}
main();
