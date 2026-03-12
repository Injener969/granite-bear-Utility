const fs = require('fs');
const path = 'c:/projects/test_project/granite-bear/src/App.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Correct the GBU_SALE_ADDRESS
const incorrectAddr = 'const GBU_SALE_ADDRESS: string = "0x5fE773cbFA9D0eAcF404B90C487F7fdcD5ec";';
const correctAddr = 'const GBU_SALE_ADDRESS: string = "0x5fE773c857cbFA9D0eAcF404B90C487F7fdcD5ec";';
content = content.replace(incorrectAddr, correctAddr);

// 2. Restore the "counter" text in the Drawer
const rateInfoMarker = '<div style={{ marginTop: \'10px\', display: \'flex\', justifyContent: \'space-between\', fontSize: \'0.7rem\', color: \'var(--text-muted)\', padding: \'0 4px\' }}>';
const rateInfoText = `
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px', textAlign: 'center' }}>
                      {paymentCurrency === 'AVAX' 
                        ? \`\${t.defi.sale.rateInfo} | ~\${(purchaseAmt / newAvaxRate).toFixed(3)} AVAX\`
                        : \`Rate: \${newUsdtRate} GBU per USDT | ~\${(purchaseAmt / newUsdtRate).toFixed(2)} USDT\`
                      }
                    </div>`;

if (!content.includes('t.defi.sale.rateInfo')) {
    content = content.replace(rateInfoMarker, rateInfoText + '\n                    ' + rateInfoMarker);
}

// 3. Remove unauthorized admin features and "auto-fetching" of rates
// First, remove the rate-fetching logic from updateBalance
const rateFetchingBlock = /try \{\s*const saleContract = new Contract\(GBU_SALE_ADDRESS, GBU_SALE_ABI, provider\);\s*const contractAvaxRate = await saleContract\.avaxRate\(\);\s*const contractUsdtRate = await saleContract\.usdtRate\(\);\s*setNewAvaxRate\(Number\(contractAvaxRate\)\);\s*setNewUsdtRate\(Number\(contractUsdtRate\)\);\s*\} catch \(e\) \{\s*console\.warn\("Could not read rates from contract, using defaults"\);\s*\}/s;
content = content.replace(rateFetchingBlock, '');

// Now remove the extra admin buttons (Withdraw GBU, Replenish GBU) and separators
const adminPanelEnd = '                  </div>\n                </div>\n              )}';
const extraAdminFeatures = /\{--- Separator ---\}\s*<div style=\{\{ borderTop: '1px solid rgba\(255,255,255,0.1\)', margin: '5px 0' \}\} \/>\s*\{--- Withdraw GBU ---\}.*?(?=<\/div>\s*<\/div>\s*<\/div>\s*\}\))/s;
// This regex is hard. I'll just look for the strings.

// Remove "Withdraw GBU" block
const withdrawGbuBlock = /\s*\{\/\* Withdraw GBU \*\/\}[\s\S]*?<\/div>[\s\S]*?<\/div>/;
content = content.replace(withdrawGbuBlock, '');

// Remove "Replenish GBU" block
const replenishGbuBlock = /\s*\{\/\* Replenish GBU \*\/\}[\s\S]*?<\/div>[\s\S]*?<\/div>/;
content = content.replace(replenishGbuBlock, '');

// Remove separators
content = content.replace(/\s*\{\/\* Separator \*\/\}[\s\S]*?<div style=\{\{ borderTop: '1px solid rgba\(255,255,255,0.1\)', margin: '5px 0' \}\} \/>/g, '');

fs.writeFileSync(path, content, 'utf8');
console.log("SUCCESS: Patched App.tsx");
