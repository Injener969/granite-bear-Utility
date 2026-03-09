const { ethers } = require('ethers');

async function main() {
    const provider = new ethers.JsonRpcProvider("https://api.avax.network/ext/bc/C/rpc");
    const wrongAddress = "0x60ae616a2a418510d486cc344265cc28236bdb9b";

    console.log(`Checking code at ${wrongAddress}...`);
    const code = await provider.getCode(wrongAddress);

    if (code === '0x') {
        console.log("RESULT: THIS IS AN EOA (PRIVATE WALLET), NOT A CONTRACT.");
    } else {
        console.log("RESULT: THIS IS A CONTRACT.");
    }
}
main();
