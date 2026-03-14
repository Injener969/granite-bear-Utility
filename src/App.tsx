import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { Wallet, CheckCircle, BarChart3, X, MoreHorizontal, TrendingUp, Zap, Send, Mail, Maximize2, Minimize2 } from 'lucide-react';
import './index.css';
import { BrowserProvider, Contract, formatUnits, parseEther, parseUnits } from 'ethers';
import { createWeb3Modal, defaultConfig, useWeb3Modal, useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers/react';
import { translations } from './translations';

// 1. Get projectId at https://cloud.walletconnect.com (It's free)
const projectId = 'c3c8d48e62f1e1d9bc5ff84a741e9e74'; // Replace with your real Project ID

// 2. Set chains
const fuji = {
  chainId: 43113,
  name: 'Avalanche Fuji',
  currency: 'AVAX',
  explorerUrl: 'https://testnet.snowtrace.io/',
  rpcUrl: 'https://api.avax-test.network/ext/bc/C/rpc'
};

const mainnet = {
  chainId: 43114,
  name: 'Avalanche Mainnet',
  currency: 'AVAX',
  explorerUrl: 'https://snowtrace.io/',
  rpcUrl: 'https://api.avax.network/ext/bc/C/rpc'
};

// 3. Create a metadata object
const metadata = {
  name: 'Granite Bear Utility',
  description: 'GBU RWA Utility Token Program',
  url: 'https://gbutoken.xyz',
  icons: ['https://gbutoken.xyz/logo-main.jpg']
};

// 4. Create Ethers config
const ethersConfig = defaultConfig({
  metadata,
  enableEIP6963: true,
  enableInjected: true,
  enableCoinbase: true,
  rpcUrl: mainnet.rpcUrl,
  defaultChainId: mainnet.chainId
});

// 5. Create modal
createWeb3Modal({
  ethersConfig,
  chains: [mainnet, fuji],
  projectId,
  allWallets: 'SHOW',
  enableAnalytics: false,
  themeVariables: {
    '--w3m-accent': '#E84142',
    '--w3m-border-radius-master': '10px',
    '--w3m-font-family': 'Montserrat, sans-serif'
  }
});

// OFFICIAL GBU MAINNET ADDRESS
const GBU_ADDRESS: string = "0x1CE7d0BBB25008f2b6b7A1Cdc0c5A9BB7eDAb96D";
const GBU_SALE_ADDRESS: string = "0x5fE773c857cbFA9D0eAcF404B90C487F7fdcD5ec";
const USDT_ADDRESS: string = "0x9702230a2441d44697590d48a91ed59151cf59c5";

const GBU_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function burn(uint256 amount) public"
];

const USDT_ABI = [
  "function approve(address spender, uint256 amount) public returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function balanceOf(address account) view returns (uint256)",
  "function decimals() view returns (uint8)"
];

const GBU_SALE_ABI = [
  "function buyWithAvax() payable",
  "function buyWithUsdt(uint256 usdtAmount)",
  "function setRates(uint256 _avaxRate, uint256 _usdtRate) external",
  "function withdrawAll() external",
  "function withdrawGbu(uint256 amount) external",
  "function avaxRate() view returns (uint256)",
  "function usdtRate() view returns (uint256)",
  "function gbuToken() view returns (address)",
  "function usdtToken() view returns (address)",
  "function owner() view returns (address)"
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const tokenomicsData = [
  { name: 'DeFi & Staking', value: 30, color: '#E84142' },
  { name: 'Liquidity Pool', value: 25, color: '#D4AF37' },
  { name: 'Team & Dev', value: 15, color: '#888888' },
  { name: 'Marketing', value: 15, color: '#555555' },
  { name: 'Loyalty', value: 15, color: '#333333' },
];

function App() {
  const [lang, setLang] = useState<'RU' | 'EN'>('RU');
  const [purchaseAmt, setPurchaseAmt] = useState(500);
  const [paymentAmt, setPaymentAmt] = useState(0.5525);
  const [scrolled, setScrolled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedCoin, setExpandedCoin] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChartExpanded, setIsChartExpanded] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [purchaseStatus, setPurchaseStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [purchaseTxHash, setPurchaseTxHash] = useState('');
  const [purchaseDetails, setPurchaseDetails] = useState({ gbu: 0, cost: 0, currency: 'AVAX' });

  // Web3 State using Modal hooks
  const { open } = useWeb3Modal();
  const { address, isConnected, chainId } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const [balance, setBalance] = useState<string>("0");
  const [paymentCurrency, setPaymentCurrency] = useState<'AVAX' | 'USDT'>('AVAX');
  const [isBurning, setIsBurning] = useState(false);
  const [burnTxHash, setBurnTxHash] = useState<string | null>(null);
  const [totalBurned, setTotalBurned] = useState(1243500); // Startup mock value
  const [verificationCode, setVerificationCode] = useState<string | null>(null);

  // Real-time DeFi Stats from DexScreener
  const [defiStats, setDefiStats] = useState({
    volume24h: 42850,
    liquidityUSD: 1240000,
    priceUSD: 0.06,
    priceChange: 12.4
  });

  const [newAvaxRate, setNewAvaxRate] = useState<number>(166);
  const [newUsdtRate, setNewUsdtRate] = useState<number>(16);
  const [replenishAmount, setReplenishAmount] = useState<number>(10000);
  const [withdrawGbuAmount, setWithdrawGbuAmount] = useState<number>(10000);

  const [saleStats, setSaleStats] = useState({
    avaxBalance: "0",
    usdtBalance: "0",
    gbuStored: "0",
    isOwner: false
  });

  const t = translations[lang];

  // Mock Price Chart Data Setup
  const [chartData, setChartData] = useState(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      time: i,
      price: 0.055 + Math.random() * 0.01 // Starts near 0.06
    }));
  });

  const [currentPrice, setCurrentPrice] = useState(0.06);

  useEffect(() => {
    const interval = setInterval(() => {
      const lastPrice = chartData[chartData.length - 1].price;
      const change = (Math.random() - 0.5) * 0.0005; // Minimal jitter
      const nextPrice = Number((lastPrice + change).toFixed(4));
      
      setCurrentPrice(nextPrice); 
      setChartData(prev => [...prev.slice(1), { time: prev[prev.length - 1].time + 1, price: nextPrice }]);
    }, 3000);
    return () => clearInterval(interval);
  }, [chartData]);

  // Real-time Fetching from DexScreener
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${GBU_ADDRESS}`);
        const data = await response.json();

        if (data.pairs && data.pairs.length > 0) {
          const mainPair = data.pairs[0]; 
          setDefiStats({
            volume24h: mainPair.volume.h24 || 0,
            liquidityUSD: mainPair.liquidity.usd || 0,
            priceUSD: parseFloat(mainPair.priceUsd) || 0,
            priceChange: mainPair.priceChange.h24 || 0
          });
          setCurrentPrice(parseFloat(mainPair.priceUsd) || 0.06);
        }
      } catch (err) {
        console.warn("DexScreener API not ready, using mock data...");
      }
    };

    fetchStats();
    const statsInterval = setInterval(fetchStats, 60000); 
    return () => clearInterval(statsInterval);
  }, []);

  const updateBalance = async () => {
    if (!isConnected || !walletProvider || !address) {
      setBalance("0");
      return;
    }
    try {
      const provider = new BrowserProvider(walletProvider);
      const gbuContract = new Contract(GBU_ADDRESS, GBU_ABI, provider);
      const bal = await gbuContract.balanceOf(address);
      setBalance(formatUnits(bal, 18));

      // Read current rates from the sale contract separately
      try {
        const saleContract = new Contract(GBU_SALE_ADDRESS, GBU_SALE_ABI, provider);
        const arate = await saleContract.avaxRate();
        const urate = await saleContract.usdtRate();
        setNewAvaxRate(Number(arate));
        setNewUsdtRate(Number(urate));
      } catch (e) {
        console.warn("Could not fetch rates from contract");
      }

      // Check if owner and fetch stats
      let isOwner = false;
      try {
        const saleContract = new Contract(GBU_SALE_ADDRESS, GBU_SALE_ABI, provider);
        const contractOwner = await saleContract.owner();
        isOwner = address.toLowerCase() === contractOwner.toLowerCase();
      } catch (e) {
        // Fallback: check known deployer address
        isOwner = address.toLowerCase() === "0x6c18c4ba7e3b4574dd70e2c2a81b0a18321d039f";
        console.warn("owner() call failed, using fallback check");
      }

      if (isOwner) {
        try {
          // Fetch balances independently
          let avaxBalStr = "0.0000";
          try {
            const avaxBal = await provider.getBalance(GBU_SALE_ADDRESS);
            avaxBalStr = parseFloat(formatUnits(avaxBal, 18)).toFixed(4);
          } catch (e) { console.error("Admin AVAX fetch error:", e); }

          let gbuStoredStr = "0";
          try {
            const gbuReserves = await gbuContract.balanceOf(GBU_SALE_ADDRESS);
            gbuStoredStr = parseFloat(formatUnits(gbuReserves, 18)).toLocaleString();
          } catch (e) { console.error("Admin GBU fetch error:", e); }

          let usdtBalStr = "0.00";
          try {
            const usdtContract = new Contract(USDT_ADDRESS, ["function balanceOf(address) view returns (uint256)"], provider);
            const usdtBal = await usdtContract.balanceOf(GBU_SALE_ADDRESS);
            usdtBalStr = parseFloat(formatUnits(usdtBal, 6)).toFixed(2);
          } catch (usdtErr) {
            console.warn("USDT balance read failed:", usdtErr);
            usdtBalStr = "0.00";
          }

          console.log("Admin stats synced:", { avax: avaxBalStr, usdt: usdtBalStr, gbu: gbuStoredStr });

          setSaleStats({
            avaxBalance: avaxBalStr,
            usdtBalance: usdtBalStr,
            gbuStored: gbuStoredStr,
            isOwner: true
          });
        } catch (e) {
          console.error("Admin panel global stats error:", e);
          setSaleStats(prev => ({ ...prev, isOwner: true }));
        }
      }
    } catch (err) {
      console.error("Error fetching balance:", err);
    }
  };

  useEffect(() => {
    if (isConnected) {
      updateBalance();
      const interval = setInterval(updateBalance, 30000);
      return () => clearInterval(interval);
    }
  }, [isConnected, address]);

  const handleUpdateRates = async () => {
    if (!walletProvider) return;
    try {
      const provider = new BrowserProvider(walletProvider);
      const signer = await provider.getSigner();
      const saleContract = new Contract(GBU_SALE_ADDRESS, GBU_SALE_ABI, signer);
      const tx = await saleContract.setRates(newAvaxRate, newUsdtRate);
      await tx.wait();
      alert(lang === 'RU' ? "Курсы успешно обновлены!" : "Rates updated successfully!");
    } catch (err) {
      console.error("Update rates failed:", err);
    }
  };

  const handleWithdrawFunds = async () => {
    if (!walletProvider) return;
    try {
      const provider = new BrowserProvider(walletProvider);
      const signer = await provider.getSigner();
      const saleContract = new Contract(GBU_SALE_ADDRESS, GBU_SALE_ABI, signer);
      const tx = await saleContract.withdrawAll();
      await tx.wait();
      alert(lang === 'RU' ? "AVAX + USDT выведены на ваш кошелёк!" : "AVAX + USDT withdrawn to your wallet!");
      updateBalance();
    } catch (err) {
      console.error("Withdraw failed:", err);
    }
  };

  const handleWithdrawGbu = async () => {
    if (!walletProvider) return;
    try {
      const provider = new BrowserProvider(walletProvider);
      const signer = await provider.getSigner();
      const saleContract = new Contract(GBU_SALE_ADDRESS, GBU_SALE_ABI, signer);
      const amount = BigInt(Math.floor(withdrawGbuAmount)) * BigInt(1e18);
      const tx = await saleContract.withdrawGbu(amount);
      await tx.wait();
      alert(lang === 'RU' ? `${withdrawGbuAmount} GBU выведены!` : `${withdrawGbuAmount} GBU withdrawn!`);
      updateBalance();
    } catch (err) {
      console.error("Withdraw GBU failed:", err);
    }
  };

  const handleReplenishGbu = async () => {
    if (!walletProvider) return;
    try {
      const provider = new BrowserProvider(walletProvider);
      const signer = await provider.getSigner();
      const gbuContract = new Contract(GBU_ADDRESS, [
        "function transfer(address to, uint256 amount) public returns (bool)"
      ], signer);
      const amount = BigInt(Math.floor(replenishAmount)) * BigInt(1e18);
      const tx = await gbuContract.transfer(GBU_SALE_ADDRESS, amount);
      await tx.wait();
      alert(lang === 'RU' ? `${replenishAmount} GBU добавлены в контракт продажи!` : `${replenishAmount} GBU added to sale contract!`);
      updateBalance();
    } catch (err) {
      console.error("Replenish GBU failed:", err);
    }
  };

  const handleBuyWithAvax = async () => {
    if (!isConnected || !walletProvider || !address) {
      open();
      return;
    }

    try {
      setIsBurning(true);
      setPurchaseStatus('processing');
      const provider = new BrowserProvider(walletProvider);
      const signer = await provider.getSigner();
      const saleContract = new Contract(GBU_SALE_ADDRESS, GBU_SALE_ABI, signer);

      // Calculate AVAX needed: purchaseAmt GBU / avaxRate = AVAX to send
      // Contract does: msg.value * avaxRate = GBU to give
      const avaxNeeded = purchaseAmt / newAvaxRate;
      const avaxWei = parseEther(avaxNeeded.toFixed(18));

      const tx = await saleContract.buyWithAvax({ value: avaxWei });
      setPurchaseTxHash(tx.hash);
      await tx.wait();

      setPurchaseDetails({ 
        gbu: purchaseAmt, 
        cost: avaxNeeded, 
        currency: 'AVAX' 
      });
      setPurchaseStatus('success');

      updateBalance();
    } catch (err: any) {
      console.error("Buy error:", err);
      alert(err.reason || err.message || "Transaction failed");
      setPurchaseStatus('idle');
    } finally {
      setIsBurning(false);
    }
  };

  const handleBuyWithUsdt = async () => {
    if (!isConnected || !walletProvider || !address) {
      open();
      return;
    }

    try {
      setIsBurning(true);
      setPurchaseStatus('processing');
      const provider = new BrowserProvider(walletProvider);
      const signer = await provider.getSigner();

      const usdtContract = new Contract(USDT_ADDRESS, USDT_ABI, signer);
      const saleContract = new Contract(GBU_SALE_ADDRESS, GBU_SALE_ABI, signer);

      // Calculate USDT needed: purchaseAmt GBU / usdtRate = USDT to send
      // Contract does: usdtAmount * usdtRate * 1e12 = GBU (adjusting 6->18 decimals)
      const usdtNeeded = purchaseAmt / newUsdtRate;
      const usdtAmount = parseUnits(usdtNeeded.toFixed(6), 6); // USDT has 6 decimals

      // Check allowance
      const allowance = await usdtContract.allowance(address, GBU_SALE_ADDRESS);
      if (allowance < usdtAmount) {
        const approveTx = await usdtContract.approve(GBU_SALE_ADDRESS, usdtAmount);
        await approveTx.wait();
      }

      const tx = await saleContract.buyWithUsdt(usdtAmount);
      setPurchaseTxHash(tx.hash);
      await tx.wait();

      setPurchaseDetails({ 
        gbu: purchaseAmt, 
        cost: usdtNeeded, 
        currency: 'USDT' 
      });
      setPurchaseStatus('success');

      updateBalance();
    } catch (err: any) {
      console.error("Buy error (USDT):", err);
      alert(err.reason || err.message || "Transaction failed");
      setPurchaseStatus('idle');
    } finally {
      setIsBurning(false);
    }
  };

  const addTokenToWallet = async () => {
    const provider = window.ethereum as any;
    if (!provider) return;
    try {
      await provider.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: GBU_ADDRESS,
            symbol: 'GBU',
            decimals: 18,
            image: `https://${window.location.host}/logo-main.jpg`,
          },
        },
      });
    } catch (error) {
      console.error("Error adding token to wallet:", error);
    }
  };

  useEffect(() => {
    if (isConnected) {
      updateBalance();
    } else {
      setBalance("0");
      setSaleStats({
        avaxBalance: "0",
        usdtBalance: "0",
        gbuStored: "0",
        isOwner: false
      });
    }
  }, [isConnected, address, walletProvider]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [copied, setCopied] = useState(false);

  const handleCopy = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    try {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(GBU_ADDRESS);
      } else {
        // Fallback for non-secure contexts
        const textArea = document.createElement("textarea");
        textArea.value = GBU_ADDRESS;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const handleBurn = async () => {
    if (!isConnected || !walletProvider || !address) {
      open();
      return;
    }

    const gbuToBurn = (purchaseAmt / currentPrice);

    try {
      setIsBurning(true);
      const provider = new BrowserProvider(walletProvider);
      const signer = await provider.getSigner();
      const contract = new Contract(GBU_ADDRESS, GBU_ABI, signer);

      const amount = BigInt(Math.floor(gbuToBurn * 1e18));
      const tx = await contract.burn(amount);
      setBurnTxHash(tx.hash);
      await tx.wait();

      const gbuBurned = Math.floor(gbuToBurn);
      setTotalBurned(prev => prev + gbuBurned);

      // Generate a simple verification code for the business owner
      const code = `GBU-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${address.slice(-4).toUpperCase()}`;
      setVerificationCode(code);

      alert(lang === 'RU' ? `Успешно сожжено! Ваш код скидки: ${code}` : `Burn successful! Your discount code: ${code}`);
      updateBalance();
    } catch (err: any) {
      console.error("Burn error:", err);
      alert(err.reason || err.message || "Transaction failed");
    } finally {
      setIsBurning(false);
    }
  };

  const getDiscountData = (amt: number) => {
    if (amt < 300) return t.loyalty.levels[0];
    if (amt < 600) return t.loyalty.levels[1];
    if (amt < 900) return t.loyalty.levels[2];
    return t.loyalty.levels[3];
  };

  const discountInfo = getDiscountData(purchaseAmt);

  return (
    <div className="app">
      <div className="bg-universe"></div>
      {/* HEADER */}
      <header className={`header ${scrolled ? 'scrolled' : ''}`}>
        <div className="container header-inner">
          {/* LEFT: MENU (MOBILE) / NAV (DESKTOP) */}
          <div className="header-left">
            <button className="mobile-only btn-menu" onClick={() => setIsMenuOpen(true)}>
              <MoreHorizontal size={24} />
            </button>
            <nav className="nav desktop-only">
              <a href="#about">{t.nav.about}</a>
              <a href="#yield">{lang === 'RU' ? 'Доходность' : 'Yield'}</a>
              <a href="#defi">DEFI</a>
              <a href="#nft">{t.nav.nft}</a>
            </nav>
          </div>

          {/* CENTER: BIG LOGO & BRANDING */}
          <div className="logo-container" onClick={() => setExpandedCoin('/logo-main.jpg')} style={{ cursor: 'pointer' }}>
            <div className="logo-img-wrapper">
              <img src="/logo-main.jpg" alt="GBU Logo" />
            </div>
            <span className="pulsing-text">GRANITE BEAR UTILITY</span>
          </div>

          {/* RIGHT: WALLET */}
          <div className="header-right">
            {isConnected && address && (
              <div
                className="balance-wrapper"
                onClick={() => setIsDrawerOpen(true)}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                <div className="glass-card balance-tag" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                  {parseFloat(balance).toLocaleString()} GBU
                </div>
                
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
              <span style={{ fontSize: '0.6rem', color: '#81c784', textAlign: 'center', letterSpacing: '0.02em', maxWidth: '160px', lineHeight: '1.2' }}>
                Прямой обмен Avax, USDT / GBU Avalanche C Chain
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', width: '100%' }}>
                <button className="btn-primary" onClick={() => open()} style={{ width: '100%', height: '40px' }}>
                  <Wallet size={16} />
                  <span className="btn-text" style={{ fontSize: '0.8rem' }}>
                    {isConnected && address ? `${address.slice(0, 4)}...${address.slice(-3)}` : t.connectWallet}
                  </span>
                </button>
                {isConnected && (
                  <button 
                    className="btn-bw" 
                    onClick={() => open({ view: 'Account' })} 
                    style={{ width: '100%', height: '35px', fontSize: '0.75rem', border: '1px solid rgba(255,100,100,0.3)', color: '#ffaaaa' }}
                  >
                    {lang === 'RU' ? 'ОТКЛЮЧИТЬ' : 'DISCONNECT'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="hero">
        <div className="canvas-container"></div>
        <div className="container hero-content">
          <motion.h1 initial="hidden" animate="visible" variants={fadeUp}>
            {t.hero.title}
          </motion.h1>
          <motion.p initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.2 }}>
            {t.hero.subtitle}
          </motion.p>
          <motion.div className="hero-buttons" initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.4 }}>
            {/* Redundant upper WP button removed as requested */}
          </motion.div>
          <motion.div className="hero-stats" initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.6 }} style={{ flexWrap: 'wrap', gap: '20px' }}>
            <div className="stat-item glass-card" style={{ padding: '15px' }}>
              <span className="stat-value">4500+</span>
              <span className="stat-label">{t.stats.tps}</span>
            </div>
            <div className="stat-item glass-card" style={{ padding: '15px' }}>
              <span className="stat-value">${currentPrice.toFixed(4)}</span>
              <span className="stat-label">{t.stats.price}</span>
            </div>
            <div className="stat-item glass-card" style={{ padding: '15px', borderColor: 'var(--accent-red)' }}>
              <span className="stat-value" style={{ color: 'var(--accent-red)' }}>
                {totalBurned.toLocaleString()}
              </span>
              <span className="stat-label">{t.stats.burned}</span>
            </div>
            <div className="stat-item glass-card" style={{ padding: '15px' }}>
              <span className="stat-value">969M</span>
              <span className="stat-label">{t.stats.supply}</span>
            </div>
            <div style={{ flex: '1 1 100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '15px' }}>
              <div className="universal-badge" style={{ marginBottom: '10px' }}>{t.stats.gbuUniversal}</div>
              <div className="stat-item pulse-avax" style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', padding: '15px 10px' }}>
                {t.stats.chains.map((chain: { name: string; desc: string }, idx: number) => (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <span style={{ fontSize: '1rem', color: 'var(--text-main)', fontWeight: 'bold' }}>{chain.name}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{chain.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section >

      {/* HOW IT WORKS */}
      < section id="about" className="section container" >
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <h2 style={{ textAlign: 'center', marginBottom: '50px' }}>{t.about.title}</h2>
          <div className="feature-grid">
            <div className="glass-card feature-card-glow feature-compact glow-green">
              <div className="feature-icon-animated"><Wallet /></div>
              <h3>{t.about.card1.title}</h3>
              <p style={{ color: 'var(--text-muted)' }}>{t.about.card1.desc}</p>
            </div>
            <div className="glass-card feature-card-glow feature-compact glow-blue">
              <div className="feature-icon-animated"><CheckCircle /></div>
              <h3>{t.about.card2.title}</h3>
              <p style={{ color: 'var(--text-muted)' }}>{t.about.card2.desc}</p>
            </div>
            <div className="glass-card feature-card-glow feature-compact">
              <div className="feature-icon-animated"><BarChart3 /></div>
              <h3>{t.about.card3.title}</h3>
              <p style={{ color: 'var(--text-muted)' }}>{t.about.card3.desc}</p>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <button className="btn-bw" onClick={() => setIsModalOpen(true)}>{t.hero.wpBtn}</button>
          </div>
        </motion.div>
      </section >

      {/* YIELD INSTRUMENTS */}
      <section id="yield" className="section container">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <h2 style={{ textAlign: 'center', marginBottom: '50px' }}>{t.features.title}</h2>
          <div className="tokenomics-grid">
            <div className="glass-card feature-card-glow feature-compact glow-gold atmos-glow">
              <div className="feature-icon-animated">
                <BarChart3 />
              </div>
              <h3>{t.features.staking.title}</h3>
              <p style={{ color: 'var(--text-muted)' }}>{t.features.staking.desc}</p>
            </div>
            <div className="glass-card feature-card-glow feature-compact glow-cyan atmos-glow">
              <div className="feature-icon-animated">
                <TrendingUp />
              </div>
              <h3>{t.features.farming.title}</h3>
              <p style={{ color: 'var(--text-muted)' }}>{t.features.farming.desc}</p>
            </div>
            <div className="glass-card feature-card-glow feature-compact glow-purple atmos-glow">
              <div className="feature-icon-animated">
                <Zap />
              </div>
              <h3>{t.features.boost.title}</h3>
              <p style={{ color: 'var(--text-muted)' }}>{t.features.boost.desc}</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* DEFI HUB */}
      <section id="defi" className="section container">
        {/* Removed motion.div animation, made it static */}
        <div>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h2 style={{ marginBottom: '5px' }}>
              <span className="tokenomics-text-gradient">{t.defi.title}</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto', fontSize: '0.9rem' }}>{t.defi.subtitle}</p>
          </div>

          <div className="defi-grid" style={{ alignItems: 'flex-start' }}>
            {/* Chart Block - Transparent with bottom glow */}
            <div className="defi-transparent-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{t.defi.chartTitle}</h3>
                  <button 
                    onClick={() => setIsChartExpanded(true)}
                    className="btn-social" 
                    style={{ padding: '6px', borderRadius: '50%', width: '32px', height: '32px', minWidth: 'auto', border: '1px solid var(--accent-red)', color: 'var(--accent-red)' }}
                    title="Expand Chart"
                  >
                    <Maximize2 size={16} />
                  </button>
                </div>
                <div className="live-indicator">
                  <div className="dot"></div>
                  LIVE
                </div>
              </div>

              <div className="chart-wrapper-internal" style={{ height: '250px', background: 'rgba(5, 5, 16, 0.4)', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
                <iframe 
                  src="https://dexscreener.com/avalanche/0x1CE7d0BBB25008f2b6b7A1Cdc0c5A9BB7eDAb96D?embed=1&theme=dark&trades=0&info=0"
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  title="GBU Chart"
                />
              </div>
            </div>

            {/* Right Column with two equal blocks */}
            <div className="defi-actions-column">
              {/* Buy Block */}
              <div className="defi-transparent-card defi-sub-card" style={{ padding: '20px' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', color: 'var(--accent-red)', marginTop: 0 }}>{t.defi.liquidityTitle}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '10px 0 20px' }}>{t.defi.liquidityDesc}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <a href="https://lfj.gg/avalanche/swap?inputCurrency=AVAX&outputCurrency=0x1CE7d0BBB25008f2b6b7A1Cdc0c5A9BB7eDAb96D&utm_medium=referral&utm_campaign=redirect" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ width: '100%', justifyContent: 'center', borderRadius: "50px" }}>
                    <TrendingUp size={18} style={{ marginRight: '8px' }} /> LFJ (DEX)
                  </a>
                  <a href={`https://dexscreener.com/avalanche/${GBU_ADDRESS}`} target="_blank" rel="noopener noreferrer" className="btn-social" style={{ width: "100%", justifyContent: "center", borderRadius: "50px" }}>
                    <BarChart3 size={18} style={{ marginRight: '8px' }} /> {t.defi.buyAnalytics}
                  </a>
                </div>
              </div>

              {/* Option A: Transparency Block */}
              <div className="defi-transparent-card defi-sub-card" style={{ padding: '20px' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', color: 'var(--accent-gold)', marginTop: 0 }}>Прозрачность контракта</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '10px 0 20px' }}>
                    Смарт-контракт GBU имеет открытый исходный код и подтвержден в сети Avalanche. Полный аудит и статистика в реальном времени.
                  </p>
                </div>
                <a href={`https://snowtrace.io/token/${GBU_ADDRESS}`} target="_blank" rel="noopener noreferrer" className="btn-social" style={{ width: "100%", borderColor: "var(--accent-gold)", color: "var(--accent-gold)", justifyContent: "center", borderRadius: "50px" }}>
                  Посмотреть на Snowtrace
                </a>
              </div>

              {/* Stats Grid */}
              <div className="defi-stats-mini" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="defi-transparent-card" style={{ padding: '15px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '5px' }}>{t.defi.stats.volume}</div>
                  <div style={{ fontWeight: '800', fontSize: '1rem' }}>${defiStats.volume24h.toLocaleString()}</div>
                </div>
                <div className="defi-transparent-card" style={{ padding: '15px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '5px' }}>{t.defi.stats.liquidity}</div>
                  <div style={{ fontWeight: '800', fontSize: '1rem' }}>${(defiStats.liquidityUSD / 1000).toFixed(1)}k+</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LOYALTY */}
      < section id="loyalty" className="section container" >
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>{t.loyalty.title}</h2>

          <div className="table-wrapper compact-table" style={{ marginBottom: '40px' }}>
            <table>
              <thead>
                <tr>
                  <th>{t.loyalty.tableTitle[0]}</th>
                  <th>{t.loyalty.tableTitle[1]}</th>
                  <th>{t.loyalty.tableTitle[2]}</th>
                  <th>{t.loyalty.tableTitle[3]}</th>
                </tr>
              </thead>
              <tbody>
                {t.loyalty.levels.map((level, i) => (
                  <tr key={i} style={i === 3 ? { background: 'rgba(212, 175, 55, 0.1)' } : {}}>
                    <td style={i === 3 ? { color: 'var(--accent-gold)' } : {}}>{level.name}</td>
                    <td>{level.burn}</td>
                    <td>{level.discount}</td>
                    <td>{level.fix}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="loyalty-dashboard" style={{ padding: '25px', marginBottom: '30px' }}>
            <div className="loyalty-info-grid">
              <div className="info-box">
                <span className="info-label">{t.loyalty.burnEquivalent}</span>
                <span className="info-value">${purchaseAmt}</span>
              </div>
              <div className="info-box">
                <span className="info-label">{t.loyalty.discountPrefix}</span>
                <span className="info-value accent">{discountInfo.discount} ({discountInfo.name})</span>
              </div>
            </div>

            <div className="info-box" style={{ marginBottom: '20px', textAlign: 'center' }}>
              <span className="info-label">{lang === 'RU' ? 'ТОКЕНОВ К СЖИГАНИЮ' : 'TOKENS TO BURN'}</span>
              <span className="info-value" style={{ color: 'var(--accent-red)', fontSize: '1.4rem' }}>
                {Math.floor(purchaseAmt / currentPrice).toLocaleString()} GBU
              </span>
            </div>

            <div className="slider-container">
              <input
                type="range"
                min="100"
                max="1000"
                step="100"
                value={purchaseAmt}
                onChange={(e) => setPurchaseAmt(Number(e.target.value))}
                className="loyalty-slider"
              />
              <div className="slider-labels">
                <span>$100</span>
                <span>$1000</span>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <button
              className={`btn-primary ${isBurning ? 'loading' : ''}`}
              style={{ padding: '12px 50px', fontSize: '1.1rem', background: 'var(--accent-red)' }}
              onClick={handleBurn}
              disabled={isBurning}
            >
              {isBurning ? (lang === 'RU' ? 'ОБРАБОТКА...' : 'BURNING...') : t.loyalty.dashboardBtn}
            </button>
            {verificationCode && burnTxHash && (
              <div className="verification-receipt">
                <div className="receipt-cut"></div>
                <div className="receipt-header">
                  <div className="receipt-logo">GRANITE BEAR</div>
                  <div className="receipt-subtitle">Official Proof of Burn</div>
                </div>

                <div className="receipt-row">
                  <span>WALLET:</span>
                  <span className="receipt-bold">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
                </div>
                <div className="receipt-row">
                  <span>STATUS:</span>
                  <span className="receipt-bold" style={{ color: '#ff3b3f' }}>VERIFIED BURN</span>
                </div>
                <div className="receipt-row">
                  <span>AMOUNT:</span>
                  <span>{Math.floor(purchaseAmt / currentPrice).toLocaleString()} GBU</span>
                </div>
                <div className="receipt-row">
                  <span>TIER:</span>
                  <span className="receipt-bold">{discountInfo.name.toUpperCase()}</span>
                </div>

                <div className="receipt-total">
                  <div className="receipt-code-box">
                    <span className="receipt-code-label">DISCOUNT VERIFICATION CODE</span>
                    <div className="receipt-code-value">{verificationCode}</div>
                  </div>
                  <div className="receipt-footer">
                    {lang === 'RU'
                      ? "Предъявите этот чек продавцу. Транзакция зафиксирована в сети Avalanche."
                      : "Present this receipt to the seller. Transaction is permanently recorded on Avalanche."}
                    <br />
                    TX: {burnTxHash.slice(0, 16)}...
                  </div>
                </div>
                <div className="receipt-cut bottom"></div>
              </div>
            )}
          </div>
        </motion.div>
      </section >

      {/* NFT */}
      <section id="nft" className="section container">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <div className="nft-centered-layout">
            
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <h2 style={{ color: 'var(--accent-gold)', marginBottom: '15px', textShadow: '0 0 20px rgba(255,194,51,0.3)' }}>CLUB GBU NFT</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Владение NFT — ваша прямая привилегия в экосистеме GBU.</p>
            </div>

            {/* CARDS CONTAINER */}
            <div className="glass-card nft-neon-glow" style={{ width: '100%', maxWidth: '700px', padding: '25px', position: 'relative', marginBottom: '30px', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(160px, 1fr))', gap: '15px', marginBottom: '15px', minWidth: '500px' }}>
                
                {/* SILVER CARD */}
                <div className="flip-card">
                  <div className="flip-card-inner">
                    <div className="flip-card-front">
                      <img src="/coin-3.jpg" alt="GBU Silver NFT" />
                    </div>
                    <div className="flip-card-back flip-card-back-silver">
                      <div className="flip-title silver-text">Silver Tier</div>
                      <div className="flip-discount silver-text">10% OFF</div>
                      <ul className="flip-perks">
                        <li>Продвинутый статус</li>
                        <li><span style={{ color: '#00ff88' }}>+10% APY</span> Буст</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* GOLD CARD */}
                <div className="flip-card" style={{ transform: 'scale(1.05)', zIndex: 2 }}>
                  <div className="flip-card-inner">
                    <div className="flip-card-front" style={{ border: '2px solid var(--accent-gold)' }}>
                      <img src="/coin-1.jpg" alt="GBU Gold NFT" />
                    </div>
                    <div className="flip-card-back flip-card-back-gold">
                      <div className="flip-title gold-text">Gold Tier</div>
                      <div className="flip-discount gold-text">15% OFF</div>
                      <ul className="flip-perks">
                        <li>Высшая привилегия</li>
                        <li><span style={{ color: '#00ff88' }}>+15% APY</span> Буст</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* BRONZE CARD */}
                <div className="flip-card">
                  <div className="flip-card-inner">
                    <div className="flip-card-front">
                      <img src="/coin-2.jpg" alt="GBU Bronze NFT" />
                    </div>
                    <div className="flip-card-back flip-card-back-bronze">
                      <div className="flip-title bronze-text">Bronze Tier</div>
                      <div className="flip-discount bronze-text">5% OFF</div>
                      <ul className="flip-perks">
                        <li>Базовый статус</li>
                        <li><span style={{ color: '#00ff88' }}>+5% APY</span> Буст</li>
                      </ul>
                    </div>
                  </div>
                </div>

              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: 'var(--accent-gold)', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Наведите на карту (Tap), чтобы увидеть детали</p>
              </div>
            </div>

            {/* TEXT & ACTION BUTTONS */}
            <div className="nft-text-container">
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', marginBottom: '40px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)' }}><CheckCircle color="var(--accent-gold)" size={20} /> Пожизненная скидка до 15% на гранит</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)' }}><CheckCircle color="var(--accent-gold)" size={20} /> Ускоренный фарминг токенов GBU</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)' }}><CheckCircle color="var(--accent-gold)" size={20} /> Статус участника закрытого комьюнити</li>
              </ul>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
                {!isConnected ? (
                  <button className="btn-primary" onClick={() => open()} style={{ minWidth: '220px', padding: '15px' }}>
                    <Wallet size={18} style={{ marginRight: '8px' }}/> Connect Wallet
                  </button>
                ) : (
                  <div className="glass-card" style={{ minWidth: '220px', padding: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid var(--accent-gold)' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Wallet Connected:</span>
                    <span style={{ fontWeight: 'bold', color: 'var(--accent-gold)', marginLeft: '10px' }}>{address?.slice(0, 4)}...{address?.slice(-4)}</span>
                  </div>
                )}
                
                <a href="https://opensea.io/" target="_blank" rel="noopener noreferrer" className="btn-emerald" style={{ minWidth: '220px', padding: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', borderRadius: '8px' }}>
                  Go to Marketplace
                </a>
              </div>
            </div>

          </div>
        </motion.div>
      </section>

      {/* TOKENOMICS (MOVED HERE) */}
      <section id="tokenomics" className="section container">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <h2 style={{ marginBottom: '10px' }}><span className="tokenomics-text-gradient">{t.tokenomics.title}</span></h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '50px' }}>{t.tokenomics.subtitle}</p>

          <div className="tokenomics-grid">
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>{t.tokenomics.tableTitle[0]}</th>
                    <th>{t.tokenomics.tableTitle[1]}</th>
                    <th>{t.tokenomics.tableTitle[2]}</th>
                  </tr>
                </thead>
                <tbody>
                  {t.tokenomics.items.map((item, i) => (
                    <tr key={i}>
                      <td>{item.name}</td>
                      <td>{item.percent}</td>
                      <td>{item.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={tokenomicsData} cx="50%" cy="50%" innerRadius={80} outerRadius={120} paddingAngle={2} dataKey="value">
                    {tokenomicsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{ background: '#1A1A1A', border: '1px solid #333' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      </section>


      {/* ROADMAP */}
      <section id="roadmap" className="section container" style={{ maxWidth: '800px' }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <h2 style={{ textAlign: 'center', marginBottom: '50px' }}>{t.roadmap.title}</h2>
          <div className="roadmap-timeline">
            {t.roadmap.phases.map((phase, i) => (
              <div key={i} className={`roadmap-item ${i === 0 ? 'active' : ''}`}>
                <h3 style={{ color: i === 0 ? 'var(--accent-red)' : 'var(--text-main)' }}>{phase.title}</h3>
                <p style={{ color: 'var(--text-muted)' }}>{phase.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="footer polished-granite">
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="footer-links" style={{ display: 'flex', justifyContent: 'center', gap: '25px', marginBottom: '25px', alignItems: 'center' }}>
            <a href={t.footer.social.email} className="social-icon-btn" aria-label="Email">
              <Mail size={20} />
            </a>
            <a href={t.footer.social.twitter} target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="X (formerly Twitter)">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a href={t.footer.social.telegram} target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="Telegram">
              <Send size={20} />
            </a>
            <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.1)', margin: '0 5px' }}></div>
            <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.8rem', fontWeight: '600' }} onClick={(e) => { e.preventDefault(); setIsModalOpen(true); }}>{t.footer.terms}</a>
            <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.8rem', fontWeight: '600' }} onClick={(e) => { e.preventDefault(); setIsModalOpen(true); }}>{t.footer.privacy}</a>
          </div>

          <div className="smart-contract" onClick={() => handleCopy()} style={{ cursor: 'pointer', transition: '0.2s' }}>
            <span style={{ color: 'var(--text-muted)' }}>{t.footer.contractLabel}:</span>
            <span className="contract-address">
              {GBU_ADDRESS === "0x0000000000000000000000000000000000000000"
                ? "Coming Soon..."
                : `${GBU_ADDRESS.slice(0, 10)}...${GBU_ADDRESS.slice(-8)}`}
            </span>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                className="btn-text-mini"
                style={{ color: copied ? 'var(--accent-loyalty)' : 'var(--accent-red)', fontWeight: 'bold' }}
              >
                {copied ? (lang === 'RU' ? 'Скопировано!' : 'Copied!') : 'Copy'}
              </button>
            </div>
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '20px' }}>{t.footer.copyright}</p>

          <p className="disclaimer" style={{ marginTop: '30px', fontSize: '0.75rem', opacity: 0.7 }}>
            {t.footer.disclaimer}
          </p>
        </div>
      </footer>

      {/* WHITEPAPER MODAL */}
      <AnimatePresence>
        {
          isModalOpen && (
            <motion.div
              className="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
            >
              <motion.div
                className="modal-content"
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-header">
                  <h2>{t.whitepaperModal.title}</h2>
                  <button className="close-btn" onClick={() => setIsModalOpen(false)}>&times;</button>
                </div>
                <div className="modal-body" dangerouslySetInnerHTML={{ __html: t.whitepaperModal.content }} />
                <div style={{ padding: '20px', textAlign: 'right', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  <button className="btn-primary" onClick={() => setIsModalOpen(false)}>{t.whitepaperModal.close}</button>
                </div>
              </motion.div>
            </motion.div>
          )
        }
      </AnimatePresence >


      <AnimatePresence>
        {expandedCoin && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setExpandedCoin(null)}
            style={{ zIndex: 10000 }}
          >
            <motion.div
              style={{ maxWidth: '90vw', maxHeight: '90vh' }}
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.5 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img src={expandedCoin} alt="Expanded NFT" style={{ width: 'auto', height: 'auto', maxWidth: '100%', maxHeight: '80vh', borderRadius: '20px', boxShadow: '0 0 50px rgba(212, 175, 55, 0.3)', border: '2px solid rgba(212, 175, 55, 0.5)' }} />
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <button className="btn-gold" onClick={() => setExpandedCoin(null)}>{t.whitepaperModal.close}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="modal-overlay"
              style={{ zIndex: 99999 }}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 100000,
                background: 'rgba(10, 10, 25, 0.98)',
                backdropFilter: 'blur(20px)',
                borderTop: '1px solid rgba(255,255,255,0.1)',
                borderTopLeftRadius: '24px',
                borderTopRightRadius: '24px',
                padding: '30px 20px',
                maxHeight: '90vh',
                overflowY: 'auto'
              }}
            >
              <div style={{ width: '40px', height: '4px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px', margin: '0 auto 20px' }} />

              <div style={{ textAlign: 'center', marginBottom: '25px' }}>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--accent-red)' }}>
                  {purchaseStatus === 'success' ? t.defi.sale.successTitle : t.defi.sale.title}
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {purchaseStatus === 'success' ? t.defi.sale.buySuccess : t.defi.sale.desc}
                </p>
              </div>

              {/* ADMIN PANEL INSIDE DRAWER (TOP) */}
              {saleStats.isOwner && (
                <div className="glass-card" style={{ marginTop: '0', marginBottom: '30px', border: '1px solid var(--accent-gold)', borderStyle: 'dashed' }}>
                  <h3 style={{ fontSize: '0.9rem', color: 'var(--accent-gold)', marginBottom: '15px', textAlign: 'center' }}>
                    ⚙️ {t.defi.sale.admin.title}
                  </h3>

                  {/* Balances: 3 columns */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '15px' }}>
                    <div style={{ textAlign: 'center', background: 'rgba(232,65,66,0.08)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(232,65,66,0.2)' }}>
                      <div style={{ fontSize: '0.6rem', color: '#E84142', fontWeight: 'bold' }}>AVAX</div>
                      <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{saleStats.avaxBalance}</div>
                    </div>
                    <div style={{ textAlign: 'center', background: 'rgba(38,161,123,0.08)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(38,161,123,0.2)' }}>
                      <div style={{ fontSize: '0.6rem', color: '#26A17B', fontWeight: 'bold' }}>USDT</div>
                      <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{saleStats.usdtBalance}</div>
                    </div>
                    <div style={{ textAlign: 'center', background: 'rgba(212,175,55,0.08)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.2)' }}>
                      <div style={{ fontSize: '0.6rem', color: 'var(--accent-gold)', fontWeight: 'bold' }}>{lang === 'RU' ? 'ЗАПАС GBU' : 'GBU STOCK'}</div>
                      <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{saleStats.gbuStored}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {/* Rate Inputs */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div>
                        <label style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{t.defi.sale.admin.rateAvaxLabel}</label>
                        <input
                          type="number"
                          value={newAvaxRate}
                          onChange={(e) => { setNewAvaxRate(Number(e.target.value)); }}
                          style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '8px', color: 'white', borderRadius: '8px', marginTop: '4px' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{t.defi.sale.admin.rateUsdtLabel}</label>
                        <input
                          type="number"
                          value={newUsdtRate}
                          onChange={(e) => { setNewUsdtRate(Number(e.target.value)); }}
                          style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '8px', color: 'white', borderRadius: '8px', marginTop: '4px' }}
                        />
                      </div>
                    </div>

                    <button onClick={handleUpdateRates} className="btn-gold" style={{ width: '100%', padding: '12px', fontSize: '0.8rem' }}>
                      📊 {t.defi.sale.admin.btnUpdate}
                    </button>

                    {/* Withdraw AVAX + USDT */}
                    <button onClick={handleWithdrawFunds} className="btn-primary" style={{ width: '100%', padding: '12px', fontSize: '0.8rem', background: '#27ae60' }}>
                      💰 {t.defi.sale.admin.btnWithdraw}
                    </button>

                    {/* Withdraw GBU */}
                    <div>
                      <label style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{lang === 'RU' ? 'Количество GBU для вывода' : 'GBU amount to withdraw'}</label>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                        <input
                          type="number"
                          value={withdrawGbuAmount}
                          onChange={(e) => { setWithdrawGbuAmount(Number(e.target.value)); }}
                          style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '8px', color: 'white', borderRadius: '8px' }}
                        />
                        <button onClick={handleWithdrawGbu} className="btn-bw" style={{ padding: '8px 16px', fontSize: '0.75rem', border: '1px solid rgba(232,65,66,0.3)', color: '#ffaaaa' }}>
                          {lang === 'RU' ? '⬆ Вывести' : '⬆ Withdraw'}
                        </button>
                      </div>
                    </div>

                    {/* Replenish GBU */}
                    <div>
                      <label style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{lang === 'RU' ? 'Пополнить контракт (GBU)' : 'Replenish contract (GBU)'}</label>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                        <input
                          type="number"
                          value={replenishAmount}
                          onChange={(e) => { setReplenishAmount(Number(e.target.value)); }}
                          style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '8px', color: 'white', borderRadius: '8px' }}
                        />
                        <button onClick={handleReplenishGbu} className="btn-bw" style={{ padding: '8px 16px', fontSize: '0.75rem', border: '1px solid rgba(38,161,123,0.3)', color: '#81c784' }}>
                          {lang === 'RU' ? '⬇ Пополнить' : '⬇ Replenish'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {purchaseStatus === 'success' ? (
                /* SUCCESS VIEW */
                <div style={{ textAlign: 'center', padding: '10px 0' }}>
                  <div className="glass-card" style={{ padding: '25px', marginBottom: '25px', border: '1px solid #27ae60' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
                      <CheckCircle size={55} color="#27ae60" />
                    </div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '10px' }}>
                      +{purchaseDetails.gbu.toLocaleString()} GBU
                    </div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                      Cost: {purchaseDetails.cost.toFixed(4)} {purchaseDetails.currency}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <a 
                      href={`https://snowtrace.io/tx/${purchaseTxHash}`} 
                      target="_blank" 
                      className="btn-bw" 
                      style={{ width: '100%', textDecoration: 'none', display: 'flex', justifyContent: 'center', gap: '8px' }}
                    >
                      <TrendingUp size={18} /> {t.defi.sale.viewOnExplorer}
                    </a>
                    <button 
                      onClick={() => { setIsDrawerOpen(false); setPurchaseStatus('idle'); }} 
                      className="btn-primary" 
                      style={{ width: '100%', height: '55px' }}
                    >
                      {t.defi.sale.backToSite}
                    </button>
                  </div>
                </div>
              ) : (
                /* IDLE / PROCESSING VIEW */
                <>
                  <div className="glass-card" style={{ marginBottom: '20px', padding: '15px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{lang === 'RU' ? 'Ваш баланс:' : 'Your balance:'}</span>
                      <button onClick={addTokenToWallet} className="btn-add-token" style={{ padding: '2px 8px', fontSize: '10px' }}>+ IMPORT GBU</button>
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-main)' }}>
                      {parseFloat(balance).toLocaleString()} GBU
                    </div>
                  </div>

                  <div style={{ marginBottom: '25px' }}>
                    {/* Currency Toggle */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                      <div 
                        onClick={() => { setPaymentCurrency('AVAX'); setPaymentAmt(+(purchaseAmt / newAvaxRate).toFixed(4)); }}
                        style={{ 
                          padding: '12px', cursor: 'pointer', borderRadius: '12px', textAlign: 'center',
                          border: `2px solid ${paymentCurrency === 'AVAX' ? '#E84142' : 'rgba(255,255,255,0.05)'}`,
                          background: paymentCurrency === 'AVAX' ? 'rgba(232, 65, 66, 0.15)' : 'rgba(255,255,255,0.02)'
                        }}>
                        <div style={{ fontSize: '1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                          <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#E84142' }} />
                          AVAX
                        </div>
                      </div>
                      <div 
                        onClick={() => { setPaymentCurrency('USDT'); setPaymentAmt(+(purchaseAmt / newUsdtRate).toFixed(2)); }}
                        style={{ 
                          padding: '12px', cursor: 'pointer', borderRadius: '12px', textAlign: 'center',
                          border: `2px solid ${paymentCurrency === 'USDT' ? '#26A17B' : 'rgba(255,255,255,0.05)'}`,
                          background: paymentCurrency === 'USDT' ? 'rgba(38, 161, 123, 0.15)' : 'rgba(255,255,255,0.02)'
                        }}>
                        <div style={{ fontSize: '1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                          <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#26A17B' }} />
                          USDT
                        </div>
                      </div>
                    </div>

                    {/* SWAP INTERFACE */}
                    {/* TOP: Payment Input */}
                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '16px', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {lang === 'RU' ? 'Вы отдаёте:' : 'You pay:'}
                        </span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: paymentCurrency === 'AVAX' ? '#E84142' : '#26A17B' }}>
                          {paymentCurrency}
                        </span>
                      </div>
                      <input
                        type="number"
                        value={paymentAmt || ''}
                        onChange={(e) => {
                          const valStr = e.target.value;
                          setPaymentAmt(valStr === '' ? 0 : Number(valStr));
                          const val = Number(valStr);
                          const rate = paymentCurrency === 'AVAX' ? newAvaxRate : newUsdtRate;
                          if (val > 0) setPurchaseAmt(Math.floor(val * rate));
                          else setPurchaseAmt(0);
                        }}
                        placeholder="0.0"
                        style={{ width: '100%', background: 'transparent', border: 'none', padding: '8px 0', color: 'white', fontSize: '1.5rem', fontWeight: 'bold', outline: 'none' }}
                      />
                    </div>

                    {/* Arrow */}
                    <div style={{ textAlign: 'center', margin: '-4px 0', position: 'relative', zIndex: 2 }}>
                      <span style={{ display: 'inline-block', background: '#1a1a2e', border: '2px solid rgba(255,255,255,0.1)', borderRadius: '50%', width: '36px', height: '36px', lineHeight: '32px', fontSize: '1.2rem' }}>↓</span>
                    </div>

                    {/* BOTTOM: GBU Output */}
                    <div style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: '16px', padding: '16px', marginTop: '-4px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {lang === 'RU' ? 'Вы получите:' : 'You receive:'}
                        </span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--accent-gold)' }}>GBU</span>
                      </div>
                      <input
                        type="number"
                        value={purchaseAmt || ''}
                        onChange={(e) => {
                          const valStr = e.target.value;
                          setPurchaseAmt(valStr === '' ? 0 : Number(valStr));
                          const val = Number(valStr);
                          const rate = paymentCurrency === 'AVAX' ? newAvaxRate : newUsdtRate;
                          if (val > 0 && rate > 0) setPaymentAmt(+(val / rate).toFixed(paymentCurrency === 'AVAX' ? 4 : 2));
                          else setPaymentAmt(0);
                        }}
                        placeholder="0"
                        style={{ width: '100%', background: 'transparent', border: 'none', padding: '8px 0', color: 'var(--accent-gold)', fontSize: '1.5rem', fontWeight: 'bold', outline: 'none' }}
                      />
                    </div>

                    {/* Rate info */}
                    
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px', textAlign: 'center' }}>
                      {paymentCurrency === 'AVAX' 
                        ? `${t.defi.sale.rateInfo} | ~${(purchaseAmt / newAvaxRate).toFixed(3)} AVAX`
                        : `Rate: ${newUsdtRate} GBU per USDT | ~${(purchaseAmt / newUsdtRate).toFixed(2)} USDT`
                      }
                    </div>
                    <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', padding: '0 4px' }}>
                      <span>{lang === 'RU' ? 'Курс:' : 'Rate:'} 1 {paymentCurrency} = {paymentCurrency === 'AVAX' ? newAvaxRate : newUsdtRate} GBU</span>
                      <span>{lang === 'RU' ? 'Цена:' : 'Price:'} 1 GBU ≈ ${(1/(paymentCurrency === 'AVAX' ? (newAvaxRate/20) : newUsdtRate)).toFixed(3)}</span>
                    </div>
                  </div>

                  {chainId !== 43114 && isConnected && (
                    <div style={{ marginBottom: '15px', padding: '10px', background: 'rgba(232, 65, 66, 0.1)', border: '1px solid var(--accent-red)', borderRadius: '8px', textAlign: 'center', color: '#ffaaaa', fontSize: '0.8rem' }}>
                      {lang === 'RU' ? 'Пожалуйста, переключите сеть на Avalanche C-Chain для покупки.' : 'Please switch your network to Avalanche C-Chain to purchase.'}
                    </div>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <button
                      onClick={paymentCurrency === 'AVAX' ? handleBuyWithAvax : handleBuyWithUsdt}
                      disabled={isBurning || (chainId !== 43114 && isConnected)}
                      className="btn-primary"
                      style={{ 
                        width: '100%', 
                        height: '55px', 
                        justifyContent: 'center', 
                        fontSize: '1rem',
                        opacity: (chainId !== 43114 && isConnected) ? 0.5 : 1,
                        background: paymentCurrency === 'USDT' ? '#26A17B' : ''
                      }}
                    >
                      <Zap size={20} style={{ marginRight: '8px' }} /> 
                      {isBurning 
                        ? (purchaseStatus === 'processing' ? 'Processing...' : 'Wait...') 
                        : (paymentCurrency === 'USDT' ? (lang === 'RU' ? 'Купить за USDT' : 'Buy with USDT') : t.defi.sale.buyAvax)
                      }
                    </button>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        onClick={() => setIsDrawerOpen(false)}
                        className="btn-bw"
                        style={{ flex: 1, height: '45px' }}
                      >
                        {lang === 'RU' ? 'Закрыть' : 'Close'}
                      </button>
                      
                    </div>
                  </div>

                </>
              )}


            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="mobile-menu-overlay"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
          >
            <div className="container" style={{ position: 'relative', height: '100%' }}>
              <button className="close-btn" style={{ position: 'absolute', top: '0', right: '0' }} onClick={() => setIsMenuOpen(false)}>
                <X size={32} />
              </button>

              <div className="mobile-menu-links">
                <a href="#about" onClick={() => setIsMenuOpen(false)}>{t.nav.about}</a>
                <a href="#yield" onClick={() => setIsMenuOpen(false)}>{lang === 'RU' ? 'Доходность' : 'Yield'}</a>
                <a href="#defi" onClick={() => setIsMenuOpen(false)}>DEFI</a>
                <a href="#nft" onClick={() => setIsMenuOpen(false)}>{t.nav.nft}</a>
                <a href="#tokenomics" onClick={() => setIsMenuOpen(false)}>{t.nav.tokenomics}</a>
                <a href="#roadmap" onClick={() => setIsMenuOpen(false)}>{t.nav.roadmap}</a>

                <div className="lang-switch" style={{ marginTop: '40px', justifyContent: 'center' }}>
                  <button className={`lang-btn ${lang === 'RU' ? 'active' : ''}`} onClick={() => setLang('RU')}>RU</button>
                  <button className={`lang-btn ${lang === 'EN' ? 'active' : ''}`} onClick={() => setLang('EN')}>EN</button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* EXPANDED CHART MODAL */}
      <AnimatePresence>
        {isChartExpanded && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ 
              position: 'fixed', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0, 
              zIndex: 9999, 
              background: 'rgba(5, 5, 16, 0.95)', 
              display: 'flex', 
              flexDirection: 'column', 
              padding: '20px' 
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, color: 'var(--accent-red)' }}>{translations[lang].defi.chartTitle} - GBU / AVAX</h2>
              <button 
                onClick={() => setIsChartExpanded(false)}
                className="btn-social" 
                style={{ padding: '10px 20px', borderRadius: '50px', background: 'var(--accent-red)', borderColor: 'var(--accent-red)', color: 'white' }}
              >
                <Minimize2 size={20} style={{ marginRight: '8px' }} /> {lang === 'RU' ? 'ЗАКРЫТЬ' : 'CLOSE'}
              </button>
            </div>
            <div style={{ flex: 1, borderRadius: '20px', overflow: 'hidden', border: '2px solid var(--glass-border)', background: '#050510' }}>
              <iframe 
                src="https://dexscreener.com/avalanche/0x1CE7d0BBB25008f2b6b7A1Cdc0c5A9BB7eDAb96D?embed=1&theme=dark"
                style={{ width: '100%', height: '100%', border: 'none' }}
                title="GBU Expanded Chart"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default App;
