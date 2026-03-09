const axios = require('axios');
const { ethers } = require('ethers');

async function main() {
    const address = "0x6c18C4ba7E3b4574dd70e2C2A81B0a18321d039f";
    const apiKey = "rs_4d795b5f937bb3e6bf42df60";
    const apiUrl = `https://api.routescan.io/v2/network/mainnet/evm/43114/etherscan/api?module=account&action=txlist&address=${address}&sort=desc&apikey=${apiKey}`;

    console.log("Fetching transaction history from Snowtrace API...");
    try {
        const response = await axios.get(apiUrl);
        if (response.data.status === '1') {
            const txs = response.data.result;
            console.log(`Found ${txs.length} transactions.\n`);

            // Looking for a transaction with value ~1 AVAX
            const targetValue = ethers.parseEther("1");
            const tolerance = ethers.parseEther("0.1"); // Looking for 0.9 to 1.1

            for (const tx of txs) {
                const val = BigInt(tx.value);
                const timeStr = new Date(parseInt(tx.timeStamp) * 1000).toLocaleString();

                if (val > 0n) {
                    console.log(`[${timeStr}] Hash: ${tx.hash}`);
                    console.log(`    Value: ${ethers.formatEther(val)} AVAX`);
                    console.log(`    To: ${tx.to}`);
                    console.log(`    Method: ${tx.functionName || 'Unknown'}`);
                    console.log(`    Status: ${tx.isError === '0' ? 'Success' : 'FAIL'}`);
                    console.log('-----------------------------------');
                }
            }
        } else {
            console.error("API Error:", response.data.message);
        }
    } catch (error) {
        console.error("Request failed:", error.message);
    }
}

main();
