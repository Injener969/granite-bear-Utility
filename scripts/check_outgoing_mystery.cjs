const axios = require('axios');
const { ethers } = require('ethers');

async function main() {
    const ownerAddress = "0x6c18C4ba7E3b4574dd70e2C2A81B0a18321d039f";
    const mysteryAddress = "0x74b0e133Bee3384DFcFA60b31D85d8e2062De811".toLowerCase();
    const apiKey = "rs_4d795b5f937bb3e6bf42df60";
    const apiUrl = `https://api.routescan.io/v2/network/mainnet/evm/43114/etherscan/api?module=account&action=txlist&address=${ownerAddress}&sort=desc&apikey=${apiKey}`;

    console.log(`Checking if ${ownerAddress} sent anything to ${mysteryAddress}...`);
    try {
        const response = await axios.get(apiUrl);
        if (response.data.status === '1') {
            const txs = response.data.result;
            const interactions = txs.filter(t => t.from.toLowerCase() === ownerAddress.toLowerCase() && t.to.toLowerCase() === mysteryAddress);

            if (interactions.length > 0) {
                console.log(`Found ${interactions.length} outgoing interactions:`);
                for (const tx of interactions) {
                    const timeStr = new Date(parseInt(tx.timeStamp) * 1000).toLocaleString();
                    console.log(`[${timeStr}] Hash: ${tx.hash}`);
                    console.log(`    Value: ${ethers.formatEther(tx.value)} AVAX`);
                    console.log(`    Status: ${tx.isError === '0' ? 'Success' : 'FAIL'}`);
                    console.log('-----------------------------------');
                }
            } else {
                console.log("No outgoing transactions to this address found.");
            }
        }
    } catch (e) {
        console.error("Error:", e.message);
    }
}
main();
