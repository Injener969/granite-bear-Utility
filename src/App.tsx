/* cSpell:disable */
import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, CheckCircle, BarChart3, X, TrendingUp, Zap, Send, Mail, Maximize2, Minimize2, Coins, ShieldCheck, FileText, Globe } from 'lucide-react';
import './index.css';
import { BrowserProvider, Contract, formatUnits, parseEther, parseUnits } from 'ethers';
import { createWeb3Modal, defaultConfig, useWeb3Modal, useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers/react';
import { translations } from './translations';
import WhitepaperContent from './components/WhitepaperContent';

const TokenomicsSection = lazy(() => import('./components/TokenomicsSection'));
const Roadmap = lazy(() => import('./components/Roadmap'));

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
  const [isChartFullscreen, setIsChartFullscreen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [purchaseStatus, setPurchaseStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [purchaseTxHash, setPurchaseTxHash] = useState('');
  const [purchaseDetails, setPurchaseDetails] = useState({ gbu: 0, cost: 0, currency: 'AVAX' });
  const [loadChart, setLoadChart] = useState(false);

  // Web3 State using Modal hooks
  const { open } = useWeb3Modal();
  const { address, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const [balance, setBalance] = useState<string>("0");
  const [paymentCurrency, setPaymentCurrency] = useState<'AVAX' | 'USDT'>('AVAX');
  const [isBurning, setIsBurning] = useState(false);
  const [burnTxHash, setBurnTxHash] = useState<string | null>(null);
  const [totalBurned, setTotalBurned] = useState(1243500); // Startup mock value
  const [verificationCode, setVerificationCode] = useState<string | null>(null);

  // Real-time DeFi Stats from DexScreener

  const [newAvaxRate, setNewAvaxRate] = useState<number>(166);
  const [newUsdtRate, setNewUsdtRate] = useState<number>(16);
  const [chainAvaxRate, setChainAvaxRate] = useState<number>(166);
  const [chainUsdtRate, setChainUsdtRate] = useState<number>(16);
  const [isRatesLoaded, setIsRatesLoaded] = useState(false);
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

  // Lazy Delay for Heavy Chart (2 seconds after load)
  useEffect(() => {
    const timer = setTimeout(() => setLoadChart(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Real-time Fetching from DexScreener
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${GBU_ADDRESS}`);
        const data = await response.json();

        if (data.pairs && data.pairs.length > 0) {
          const mainPair = data.pairs[0];
          setCurrentPrice(parseFloat(mainPair.priceUsd) || 0.06);
        }
      } catch {
        console.warn("DexScreener API not ready, using mock data...");
      }
    };

    fetchStats();
    const statsInterval = setInterval(fetchStats, 300000); 
    return () => clearInterval(statsInterval);
  }, []);

  const updateAdminStats = useCallback(async (provider: BrowserProvider, gbuContract: Contract) => {
    try {
      const saleContract = new Contract(GBU_SALE_ADDRESS, GBU_SALE_ABI, provider);
      const contractOwner = await saleContract.owner().catch(() => "0x6c18c4ba7e3b4574dd70e2c2a81b0a18321d039f");
      const isOwner = address?.toLowerCase() === contractOwner.toLowerCase();

      if (isOwner) {
        const [avaxBal, gbuReserves, usdtBalRaw, chainAvaxRate, chainUsdtRate] = await Promise.all([
          provider.getBalance(GBU_SALE_ADDRESS).catch(() => 0n),
          gbuContract.balanceOf(GBU_SALE_ADDRESS).catch(() => 0n),
          new Contract(USDT_ADDRESS, ["function balanceOf(address) view returns (uint256)"], provider).balanceOf(GBU_SALE_ADDRESS).catch(() => 0n),
          saleContract.avaxRate().catch(() => 166n),
          saleContract.usdtRate().catch(() => 16n)
        ]);

        setSaleStats({
          avaxBalance: parseFloat(formatUnits(avaxBal, 18)).toFixed(4),
          usdtBalance: parseFloat(formatUnits(usdtBalRaw, 6)).toFixed(2),
          gbuStored: parseFloat(formatUnits(gbuReserves, 18)).toLocaleString(),
          isOwner: true
        });

        const cAvax = Number(chainAvaxRate);
        const cUsdt = Number(chainUsdtRate);
        setChainAvaxRate(cAvax);
        setChainUsdtRate(cUsdt);
        
        // Initial load for inputs
        if (!isRatesLoaded) {
          setNewAvaxRate(cAvax);
          setNewUsdtRate(cUsdt);
          setIsRatesLoaded(true);
        }
      } else {
        setSaleStats(prev => ({ ...prev, isOwner: false }));
        setIsRatesLoaded(false); // Reset when disconnect
      }
    } catch (err) {
      console.error("Admin stats sync error:", err);
    }
  }, [address, isRatesLoaded]);

  const updateBalance = useCallback(async () => {
    if (!isConnected || !walletProvider || !address) {
      setBalance("0");
      setSaleStats(prev => ({ ...prev, isOwner: false }));
      return;
    }
    try {
      const provider = new BrowserProvider(walletProvider);
      const gbuContract = new Contract(GBU_ADDRESS, GBU_ABI, provider);
      const bal = await gbuContract.balanceOf(address);
      setBalance(formatUnits(bal, 18));
      
      await updateAdminStats(provider, gbuContract);
    } catch (err) {
      console.error("Error fetching balance:", err);
    }
  }, [isConnected, walletProvider, address, updateAdminStats]);

  useEffect(() => {
    updateBalance();
    if (isConnected) {
      const interval = setInterval(updateBalance, 30000);
      return () => clearInterval(interval);
    }
  }, [isConnected, address, updateBalance]);

  const handleUpdateRates = async () => {
    if (!walletProvider) return;
    try {
      const provider = new BrowserProvider(walletProvider);
      const signer = await provider.getSigner();
      const saleContract = new Contract(GBU_SALE_ADDRESS, GBU_SALE_ABI, signer);
      const tx = await saleContract.setRates(newAvaxRate, newUsdtRate);
      await tx.wait();
      setChainAvaxRate(newAvaxRate);
      setChainUsdtRate(newUsdtRate);
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
    } catch (err: unknown) {
      const error = err as { reason?: string; message?: string };
      console.error("Buy error:", err);
      alert(error.reason || error.message || "Transaction failed");
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
    } catch (err: unknown) {
      const error = err as { reason?: string; message?: string };
      console.error("Buy error (USDT):", err);
      alert(error.reason || error.message || "Transaction failed");
      setPurchaseStatus('idle');
    } finally {
      setIsBurning(false);
    }
  };

  const addTokenToWallet = async () => {
    const provider = window.ethereum as { request: (args: { method: string; params: unknown }) => Promise<void> };
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
    } catch (err: unknown) {
      const error = err as { reason?: string; message?: string };
      console.error("Burn error:", err);
      alert(error.reason || error.message || "Transaction failed");
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
            <button 
              className="mobile-only btn-menu" 
              onClick={() => setIsMenuOpen(true)}
              aria-label={lang === 'RU' ? "Открыть меню" : "Open menu"}
            >
              <div className="three-dots">
                <span className="dot dot-emerald"></span>
                <span className="dot dot-blue"></span>
                <span className="dot dot-purple"></span>
              </div>
            </button>
            <nav className="nav desktop-only">
              <a href="#about">{t.nav.about}</a>
              <a href="#yield">{lang === 'RU' ? 'Доходность' : 'Yield'}</a>
              <a href="#defi">DEFI</a>
              <a href="#nft">{t.nav.nft}</a>
            </nav>
          </div>

          {/* CENTER: BIG LOGO & BRANDING */}
          <div className="logo-container logo-clickable" onClick={() => setExpandedCoin('/logo-main.jpg')}>
            <div className="logo-img-wrapper">
              <img src="/logo-main.jpg" alt="GBU Logo" />
            </div>
            <span className="pulsing-text">GRANITE BEAR UTILITY</span>
          </div>

          {/* RIGHT: WALLET & BUY */}
          <div className="header-right header-right-flex">
            
            {isConnected && address && (
              <button
                className="btn-buy-header"
                onClick={() => setIsDrawerOpen(true)}
              >
                <Zap size={14} className="color-accent-loyalty" />
                <span className="btn-buy-text">{lang === 'RU' ? 'КУПИТЬ' : 'BUY'}</span>
                <div className="divider-vertical" />
                <span className="balance-value">{parseFloat(balance).toLocaleString()} GBU</span>
              </button>
            )}

            <div className="header-wallet-column">
              <span className="exchange-hint-text">
                Прямой обмен Avax, USDT / GBU Avalanche C Chain
              </span>
              <div className="wallet-btn-container">
                <button className="btn-primary yield-btn-small" onClick={() => open()}>
                  <Wallet size={16} />
                  <span className="btn-text wallet-btn-text-small">
                    {isConnected && address ? `${address.slice(0, 4)}...${address.slice(-3)}` : t.connectWallet}
                  </span>
                </button>
              </div>
            </div>

            {/* Desktop Lang Switch */}
            <div className="lang-switch desktop-only margin-left-8">
              <button 
                className={`lang-btn ${lang === 'RU' ? 'active' : ''}`} 
                onClick={() => setLang('RU')}
              >
                RU
              </button>
              <button 
                className={`lang-btn ${lang === 'EN' ? 'active' : ''}`} 
                onClick={() => setLang('EN')}
              >
                EN
              </button>
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
          <motion.div className="flex-justify-center-margin-30" initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.4 }}>
            <button className="white-hero-wp-btn" onClick={() => setIsModalOpen(true)}>
              <FileText size={16} className="margin-right-10" /> {t.hero.wpBtn}
            </button>
          </motion.div>
          <motion.div className="hero-stats hero-stats-flex" initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.6 }}>
            <div className="stat-item glass-card stat-item-padding">
              <span className="stat-value">4500+</span>
              <span className="stat-label">{t.stats.tps}</span>
            </div>
            <div className="stat-item glass-card padding-15">
              <span className="stat-value">${currentPrice.toFixed(4)}</span>
              <span className="stat-label">{t.stats.price}</span>
            </div>
            <div className="stat-item glass-card stat-item-padding border-accent-red">
              <span className="stat-value stat-value-accent-red">
                {totalBurned.toLocaleString()}
              </span>
              <span className="stat-label">{t.stats.burned}</span>
            </div>
            <div className="stat-item glass-card padding-15">
              <span className="stat-value">969M</span>
              <span className="stat-label">{t.stats.supply}</span>
            </div>
            <div className="chains-row-full">
              <div className="universal-badge universal-badge-margin">{t.stats.gbuUniversal}</div>
              <div className="stat-item pulse-avax pulse-avax-inner">
                {t.stats.chains.map((chain: { name: string; desc: string }, idx: number) => (
                  <div key={idx} className="chain-box">
                    <span className="chain-name-text">{chain.name}</span>
                    <span className="chain-desc-text">{chain.desc}</span>
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
          <h2 className="text-center">{t.about.title}</h2>
          <div className="feature-grid">
            <div className="glass-card feature-card-glow feature-compact glow-green">
              <div className="feature-icon-animated"><Wallet /></div>
              <h3>{t.about.card1.title}</h3>
              <p className="text-muted-color">{t.about.card1.desc}</p>
            </div>
            <div className="glass-card feature-card-glow feature-compact glow-blue">
              <div className="feature-icon-animated"><CheckCircle /></div>
              <h3>{t.about.card2.title}</h3>
              <p className="text-muted-color">{t.about.card2.desc}</p>
            </div>
            <div className="glass-card feature-card-glow feature-compact">
              <div className="feature-icon-animated"><BarChart3 /></div>
              <h3>{t.about.card3.title}</h3>
              <p className="text-muted-color">{t.about.card3.desc}</p>
            </div>
          </div>
          {/* Кнопка перенесена в меню (три точки) по просьбе пользователя */}
          {/* Блок Whitepaper отсюда удален и перенесен в мобильное меню (три точки) */}
        </motion.div>
      </section >

      {/* YIELD INSTRUMENTS */}
      <section id="yield" className="section container">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <h2 className="features-title-style">{t.features.title}</h2>
          <div className="grid">
            <div className="glass-card feature-card">
              <div className="icon-box"><Coins size={32} color="var(--accent-red)" /></div>
              <h3>{t.features.staking.title}</h3>
              <p className="feature-desc-muted">{t.features.staking.desc}</p>
            </div>
            <div className="glass-card feature-card">
              <div className="icon-box"><Zap size={32} color="var(--accent-red)" /></div>
              <h3>{t.features.farming.title}</h3>
              <p className="feature-desc-muted">{t.features.farming.desc}</p>
            </div>
            <div className="glass-card feature-card">
              <div className="icon-box"><Zap size={32} color="var(--accent-red)" /></div>
              <h3>{t.features.boost.title}</h3>
              <p className="feature-desc-muted">{t.features.boost.desc}</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* DEFI HUB */}
      <section id="defi" className="section container">
        <div className="features-header-box">
          <h2>
            <span className="tokenomics-text-gradient">{t.defi.title}</span>
          </h2>
          <p className="feature-desc-muted">{t.defi.subtitle}</p>
        </div>

        <div className="defi-grid">
          {/* Left Column: Live Chart */}
          <div className="defi-transparent-card defi-card-padding">
            <div className="defi-chart-header">
              <div className="defi-title-with-btn">
                <h3 className="defi-title-small">GBU / AVAX LIVE</h3>
                <div className="live-indicator">
                  <span className="dot"></span> LIVE
                </div>
              </div>
              <button 
                onClick={() => setIsChartFullscreen(true)} 
                className="btn-expand-chart"
                title={lang === 'RU' ? "Развернуть график" : "Expand chart"}
              >
                <Maximize2 size={16} />
              </button>
            </div>
            <div className="chart-container-internal relative-container">
              {loadChart ? (
                <iframe
                  src={`https://dexscreener.com/avalanche/${GBU_ADDRESS}?embed=1&theme=dark&trades=0&info=0`}
                  className="chart-iframe"
                  title="GBU Chart"
                  loading="eager"
                />
              ) : (
                <div className="flex-column-center height-100-percent">
                   <div className="live-indicator">
                      <span className="dot pulsing"></span> {lang === 'RU' ? 'ЗАГРУЗКА ГРАФИКА...' : 'LOADING CHART...'}
                   </div>
                </div>
              )}
            </div>
            <div className="margin-top-15 text-center">
              <a 
                href={`https://dexscreener.com/avalanche/${GBU_ADDRESS}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-social padding-8-20 text-decoration-none"
              >
                <BarChart3 size={14} className="margin-right-8" /> {lang === 'RU' ? 'ОТКРЫТЬ В DEXSCREENER' : 'OPEN IN DEXSCREENER'}
              </a>
            </div>
          </div>

          {/* Right Column: Actions & Stats */}
          <div className="defi-actions-column">
            {/* Market Hub */}
            <div className="defi-transparent-card defi-sub-card-padding margin-bottom-20">
              <h3 className="defi-sub-card-title glow-green-text">{t.defi.marketHub}</h3>
              <p className="defi-sub-card-desc margin-bottom-15">
                {lang === 'RU' ? 'Добавь ликвидность и получай % с комиссии' : 'Add liquidity and earn % from fees'}
              </p>
              <div className="flex-col-gap-12">
                <a 
                  href="https://lfj.gg/avalanche/pool/v1/0x1ce7d0bbb25008f2b6b7a1cdc0c5a9bb7edab96d/AVAX"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-cyan btn-full-width-round text-decoration-none"
                >
                  <Zap size={18} className="defi-icon-margin" /> {lang === 'RU' ? 'ДОБАВЬ ЛИКВИДНОСТЬ' : 'ADD LIQUIDITY'}
                </a>
              </div>
            </div>

            {/* Transparency */}
            <div className="defi-transparent-card defi-sub-card-padding margin-bottom-20">
              <h3 className="defi-sub-card-title-gold">{t.defi.transparencyTitle}</h3>
              <p className="defi-sub-card-desc margin-bottom-15">{t.defi.transparencyDesc}</p>
              <div className="flex-col-gap-12">
                <a 
                  href={`https://snowtrace.io/token/${GBU_ADDRESS}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-purple btn-full-width-round text-decoration-none"
                >
                  <ShieldCheck size={18} className="defi-icon-margin" /> CONTRACT
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LOYALTY */}
      <section id="loyalty" className="section container">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="loyalty-motion-container">
          <h2 className="text-center">{t.loyalty.title}</h2>

          <div className="table-wrapper compact-table margin-bottom-40">
            <div className="table-responsive-wrapper">
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
                    <tr key={i} className={i === 3 ? "gold-background" : ""}>
                      <td className={i === 3 ? "gold-text" : ""}>{level.name}</td>
                      <td>{level.burn}</td>
                      <td>{level.discount}</td>
                      <td>{level.fix}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="loyalty-dashboard loyalty-dashboard-padding margin-bottom-30">
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

            <div className="info-box tokens-to-burn-box">
              <span className="info-label">{lang === 'RU' ? 'ТОКЕНОВ К СЖИГАНИЮ' : 'TOKENS TO BURN'}</span>
              <span className="info-value tokens-to-burn-value-text">
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
                aria-label={lang === 'RU' ? 'Сумма сжигания в долларах' : 'Burn amount in USD'}
              />
              <div className="slider-labels">
                <span>$100</span>
                <span>$1000</span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              className={`btn-primary ${isBurning ? 'loading' : ''} btn-burn-action`}
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
                  <span className="receipt-bold receipt-verified-text">VERIFIED BURN</span>
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
          <div className="nft-header-text">
            <h2 className="nft-main-title">{t.nft.title}</h2>
            <p className="nft-subtitle">{t.nft.subtitle}</p>
          </div>


          <div className="nft-centered-layout">
            
            {/* CARDS CONTAINER */}
            <div className="glass-card nft-neon-glow nft-cards-container">
              <div className="nft-cards-row">
                <div className="nft-cards-grid-internal">
                
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
                          <li><span className="perk-boost-text">+10% APY</span> Буст</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* GOLD CARD */}
                  <div className="flip-card nft-gold-card-highlight">
                    <div className="flip-card-inner">
                      <div className="flip-card-front nft-gold-card-border">
                        <img src="/coin-1.jpg" alt="GBU Gold NFT" />
                      </div>
                      <div className="flip-card-back flip-card-back-gold">
                        <div className="flip-title gold-text">Gold Tier</div>
                        <div className="flip-discount gold-text">15% OFF</div>
                        <ul className="flip-perks">
                          <li>Высшая привилегия</li>
                          <li><span className="perk-boost-text">+15% APY</span> Буст</li>
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
                          <li><span className="perk-boost-text">+5% APY</span> Буст</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
              <div className="nft-hint-text">
                Наведите на карту (Tap), чтобы увидеть детали
              </div>
            </div>

            {/* TEXT & ACTION BUTTONS */}
            <div className="nft-text-container">
              <ul className="nft-perks-container">
                <li className="nft-perk-item"><CheckCircle color="var(--accent-gold)" size={20} /> Пожизненная скидка до 15% на гранит</li>
                <li className="nft-perk-item"><CheckCircle color="var(--accent-gold)" size={20} /> Ускоренный фарминг токенов GBU</li>
                <li className="nft-perk-item"><CheckCircle color="var(--accent-gold)" size={20} /> Статус участника открытого комьюнити</li>
              </ul>

              <div className="nft-actions-flex">
                {!isConnected ? (
                  <button className="btn-primary btn-nft-mint nft-btn-min-width" onClick={() => open()}>
                    <Wallet size={18} className="margin-right-8" /> Connect Wallet
                  </button>
                ) : (
                  <div className="glass-card wallet-connected-box">
                    <span className="text-small-muted">Wallet Connected:</span>
                    <span className="text-bold-gold">{address?.slice(0, 4)}...{address?.slice(-4)}</span>
                  </div>
                )}
                
                <a href="https://opensea.io/" target="_blank" rel="noopener noreferrer" className="btn-emerald btn-marketplace">
                  Go to Marketplace
                </a>
              </div>
            </div>

          </div>
        </motion.div>
      </section>

      {/* TOKENOMICS (LAZY LOADED) */}
      <Suspense fallback={<div className="text-center padding-50">Loading Tokenomics...</div>}>
        <TokenomicsSection t={t} tokenomicsData={tokenomicsData} />
      </Suspense>

      {/* ROADMAP (LAZY LOADED) */}
      <Suspense fallback={<div className="text-center padding-50">Loading Roadmap...</div>}>
        <Roadmap t={t} />
      </Suspense>



      {/* FOOTER */}
      <footer className="footer polished-granite">
        <div className="container text-center">
          <div className="footer-links flex-row-center-gap-25">
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
            <div className="footer-divider-line"></div>
            <a href="#" className="footer-legal-link" onClick={(e) => { e.preventDefault(); setIsModalOpen(true); }}>{t.footer.terms}</a>
            <a href="#" className="footer-legal-link" onClick={(e) => { e.preventDefault(); setIsModalOpen(true); }}>{t.footer.privacy}</a>
          </div>

          <div className="smart-contract contract-box-clickable" onClick={() => handleCopy()}>
            <span className="text-muted-color">{t.footer.contractLabel}:</span>
            <span className="contract-address">
              {GBU_ADDRESS === "0x0000000000000000000000000000000000000000"
                ? "Coming Soon..."
                : `${GBU_ADDRESS.slice(0, 10)}...${GBU_ADDRESS.slice(-8)}`}
            </span>
            <div className="footer-copy-btn-flex">
              <button
                className={`btn-text-mini copy-btn-text-style ${copied ? 'color-accent-loyalty' : 'color-accent-red'}`}
              >
                {copied ? (lang === 'RU' ? 'Скопировано!' : 'Copied!') : 'Copy'}
              </button>
            </div>
          </div>

          <p className="footer-copyright-text">{t.footer.copyright}</p>

          <p className="disclaimer disclaimer-footer-style">
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
                  <button className="close-btn" onClick={() => setIsModalOpen(false)} aria-label="Close">&times;</button>
                </div>
                <div className="modal-body">
                  <WhitepaperContent lang={lang} />
                </div>
                <div className="modal-footer-box">
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
            className="modal-overlay modal-overlay-z"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setExpandedCoin(null)}
          >
            <motion.div
              className="img-expand-container"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.5 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img src={expandedCoin} alt="Expanded NFT" className="expanded-nft-img" />
              <div className="text-center margin-top-20">
                <button className="btn-gold" onClick={() => setExpandedCoin(null)}>{t.whitepaperModal.close}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDrawerOpen && (
          <motion.div
            key="drawer-wrapper"
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="modal-overlay z-index-99999"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="modal-panel-fixed"
            >
              <button 
                onClick={() => setIsDrawerOpen(false)} 
                className="drawer-close-btn-fancy"
                aria-label={lang === 'RU' ? "Закрыть" : "Close"}
              >
                <X size={24} />
              </button>
              <div className="modal-drag-handle" />

              <div className="modal-header-box">
                <h3 className="modal-title-red">
                  {purchaseStatus === 'success' ? t.defi.sale.successTitle : t.defi.sale.title}
                </h3>
                <p className="modal-desc-muted">
                  {purchaseStatus === 'success' ? t.defi.sale.buySuccess : t.defi.sale.desc}
                </p>
              </div>

              {/* PREMIUM ACTIONS GRID (Import GBU) - Only when connected */}
              {isConnected && purchaseStatus !== 'success' && (
                <div className="single-action-container margin-bottom-20">
                  <button 
                    className="btn-premium-action btn-import-cyan btn-full-width"
                    onClick={addTokenToWallet}
                  >
                    <Coins size={20} />
                    <span>{lang === 'RU' ? 'ИМПОРТ GBU В КОШЕЛЕК' : 'IMPORT GBU TO WALLET'}</span>
                  </button>
                </div>
              )}

              {purchaseStatus === 'success' ? (
                /* SUCCESS VIEW */
                <div className="text-center padding-v-10">
                  <div className="glass-card success-card-border padding-25 margin-bottom-25">
                    <div className="success-icon-box">
                      <CheckCircle size={55} color="#27ae60" />
                    </div>
                    <div className="success-amount-text">
                      +{purchaseDetails.gbu.toLocaleString()} GBU
                    </div>
                    <div className="success-cost-text">
                      Cost: {purchaseDetails.cost.toFixed(4)} {purchaseDetails.currency}
                    </div>
                  </div>

                  <div className="success-actions-col">
                    <a 
                      href={`https://snowtrace.io/tx/${purchaseTxHash}`} 
                      target="_blank" 
                      className="btn-bw admin-full-width flex-row-center-gap-8 text-decoration-none"
                    >
                      <TrendingUp size={18} /> {t.defi.sale.viewOnExplorer}
                    </a>
                    <button 
                      onClick={() => { setIsDrawerOpen(false); setPurchaseStatus('idle'); }} 
                      className="btn-primary admin-full-width height-55"
                    >
                      {t.defi.sale.backToSite}
                    </button>
                  </div>
                </div>
              ) : (
                /* IDLE / PROCESSING VIEW */
                <>
                  <div className="glass-card buy-balance-simple">
                    <span className="buy-balance-label">{lang === 'RU' ? 'Ваш баланс:' : 'Your balance:'}</span>
                    <span className="buy-balance-value-main">
                      {parseFloat(balance).toLocaleString()} GBU
                    </span>
                  </div>

                  <div className="margin-bottom-25">
                    {/* Currency Toggle */}
                    <div className="buy-currency-grid">
                      <div 
                        onClick={() => { setPaymentCurrency('AVAX'); setPaymentAmt(+(purchaseAmt / newAvaxRate).toFixed(4)); }}
                        className={`glass-card clickable flex-col-center padding-15 transition-02 ${paymentCurrency === 'AVAX' ? 'currency-btn-active-red' : 'currency-btn-inactive'}`}
                      >
                        <div className="currency-btn-content">
                          <span className="dot-red" /> AVAX
                        </div>
                      </div>
                      <div 
                        onClick={() => { setPaymentCurrency('USDT'); setPaymentAmt(+(purchaseAmt / (newUsdtRate || 1)).toFixed(4)); }}
                        className={`glass-card clickable flex-col-center padding-15 transition-02 ${paymentCurrency === 'USDT' ? 'currency-btn-active-emerald' : 'currency-btn-inactive'}`}
                      >
                        <div className="currency-btn-content">
                          <span className="dot-emerald" /> USDT
                        </div>
                      </div>
                    </div>

                    <div className="input-group-container">
                      <div className="input-header-flex">
                        <span className="input-label-text">
                          {lang === 'RU' ? 'ВЫ ОТДАЕТЕ' : 'YOU PAY'}
                        </span>
                        <span className="text-xxs-bold-red">
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
                        className="input-main-field"
                        placeholder="0.0"
                      />
                    </div>

                    <div className="input-arrow-divider">
                      <span className="arrow-circle">↓</span>
                    </div>

                    <div className="input-group-gbu">
                      <div className="input-header-flex">
                        <span className="input-label-text">
                          {lang === 'RU' ? 'ВЫ ПОЛУЧАЕТЕ (GBU)' : 'YOU RECEIVE (GBU)'}
                        </span>
                        <span className="admin-label-gold">GBU</span>
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
                        className="input-main-field input-main-field-gold"
                        placeholder="0.0"
                      />
                    </div>

                    {/* Rate info */}
                    <div className="buy-details-flex">
                      <span>{lang === 'RU' ? 'Курс GBU (в $):' : 'GBU Price (USD):'}</span>
                      <span className="text-bold-gold">${(1 / (newUsdtRate || 1)).toFixed(4)}</span>
                    </div>
                    <div className="buy-details-flex">
                      <span>{lang === 'RU' ? 'Сеть:' : 'Network:'}</span>
                      <span>Avalanche C-Chain</span>
                    </div>

                    <div className="rate-footer-text buy-rate-indicator-box">
                      1 {paymentCurrency} = <span className="text-white-bold">{paymentCurrency === 'AVAX' ? chainAvaxRate : chainUsdtRate}</span> GBU
                    </div>
                  </div>

                  <div className="buy-actions-grid">
                    {!isConnected ? (
                      <button onClick={() => open()} className="btn-primary btn-wallet-connect-full">
                        <Wallet size={20} className="margin-right-8" /> 
                        {lang === 'RU' ? 'Подключить кошелёк' : 'Connect Wallet'}
                      </button>
                    ) : (
                      <>
                        <div className="flex-row-gap-10">
                          <button 
                            onClick={paymentCurrency === 'AVAX' ? handleBuyWithAvax : handleBuyWithUsdt}
                            disabled={isBurning} 
                            className={`btn-gold flex-1-height-45 ${isBurning ? 'loading' : ''}`}
                          >
                            {isBurning ? (lang === 'RU' ? 'ОБРАБОТКА...' : 'BUYING...') : (lang === 'RU' ? 'КУПИТЬ GBU' : 'BUY GBU')}
                          </button>
                          <button 
                            onClick={() => setIsDrawerOpen(false)} 
                            className="btn-bw flex-1-height-45"
                          >
                            {lang === 'RU' ? 'ОТМЕНА' : 'CANCEL'}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}

              {/* ADMIN PANEL SEPARATOR */}
              {saleStats.isOwner && <div className="admin-section-divider" />}

              {/* ADMIN PANEL INSIDE DRAWER (BOTTOM) */}
              {saleStats.isOwner && (
                <div className="glass-card margin-top-30 gold-dashed-border">
                  <h3 className="admin-card-header">
                    ⚙️ {t.defi.sale.admin.title}
                  </h3>

                  {/* Balances: 3 columns */}
                  <div className="admin-balances-grid">
                    <div className="admin-balance-box admin-balance-avax">
                      <div className="admin-label-red">AVAX</div>
                      <div className="admin-value-bold">{saleStats.avaxBalance}</div>
                    </div>
                    <div className="admin-balance-box admin-balance-usdt">
                      <div className="admin-label-emerald">USDT</div>
                      <div className="admin-value-bold">{saleStats.usdtBalance}</div>
                    </div>
                    <div className="admin-balance-box admin-balance-gbu">
                      <div className="admin-label-gold">{lang === 'RU' ? 'ЗАПАС GBU' : 'GBU STOCK'}</div>
                      <div className="admin-value-bold">{saleStats.gbuStored}</div>
                    </div>
                  </div>

                  <div className="admin-flex-col-gap-12">
                    {/* Rate Inputs */}
                    <div className="admin-input-grid">
                      <div>
                        <label htmlFor="avax-rate" className="admin-input-label">{t.defi.sale.admin.rateAvaxLabel}</label>
                        <input
                          id="avax-rate"
                          type="number"
                          value={newAvaxRate}
                          onChange={(e) => { setNewAvaxRate(Number(e.target.value)); }}
                          className="admin-input-field"
                          placeholder="AVAX Rate"
                          title="Avalanche to GBU convert rate"
                        />
                      </div>
                      <div>
                        <label htmlFor="usdt-rate" className="admin-input-label">{t.defi.sale.admin.rateUsdtLabel}</label>
                        <input
                          id="usdt-rate"
                          type="number"
                          value={newUsdtRate}
                          onChange={(e) => { setNewUsdtRate(Number(e.target.value)); }}
                          className="admin-input-field"
                          placeholder="USDT Rate"
                          title="USDT to GBU convert rate"
                        />
                      </div>
                    </div>

                    <button onClick={handleUpdateRates} className="btn-gold btn-padding-12-text-08 admin-full-width">
                      📊 {t.defi.sale.admin.btnUpdate}
                    </button>

                    {/* Withdraw AVAX + USDT */}
                    <button onClick={handleWithdrawFunds} className="btn-primary admin-btn-withdraw">
                      💰 {t.defi.sale.admin.btnWithdraw}
                    </button>

                    {/* Withdraw GBU */}
                    <div>
                      <label htmlFor="withdraw-gbu" className="admin-input-label">{lang === 'RU' ? 'Количество GBU для вывода' : 'GBU amount to withdraw'}</label>
                      <div className="admin-action-row">
                        <input
                          id="withdraw-gbu"
                          type="number"
                          value={withdrawGbuAmount}
                          onChange={(e) => { setWithdrawGbuAmount(Number(e.target.value)); }}
                          className="admin-input-field margin-0 flex-1"
                        />
                        <button onClick={handleWithdrawGbu} className="btn-bw admin-btn-action admin-btn-withdraw-gbu">
                          {lang === 'RU' ? '⬆ Вывести' : '⬆ Withdraw'}
                        </button>
                      </div>
                    </div>

                    {/* Replenish GBU */}
                    <div>
                      <label htmlFor="replenish-gbu" className="admin-input-label">{lang === 'RU' ? 'Пополнить контракт (GBU)' : 'Replenish contract (GBU)'}</label>
                      <div className="admin-action-row">
                        <input
                          id="replenish-gbu"
                          type="number"
                          value={replenishAmount}
                          onChange={(e) => { setReplenishAmount(Number(e.target.value)); }}
                          className="admin-input-field margin-0 flex-1"
                        />
                        <button onClick={handleReplenishGbu} className="btn-bw admin-btn-action admin-btn-replenish">
                          {lang === 'RU' ? '⬇ Пополнить' : '⬇ Replenish'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
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
            <div className="container modal-container-rel">
              <button 
                className="close-btn modal-close-btn-pos" 
                onClick={() => setIsMenuOpen(false)}
                aria-label={lang === 'RU' ? "Закрыть меню" : "Close menu"}
              >
                <X size={32} />
              </button>

              <div className="mobile-nav-grid">
                <a href="#about" className="mobile-nav-btn" onClick={() => setIsMenuOpen(false)}>
                  <CheckCircle size={22} />
                  <span>{t.nav.about}</span>
                </a>
                <a href="#yield" className="mobile-nav-btn" onClick={() => setIsMenuOpen(false)}>
                  <TrendingUp size={22} />
                  <span>{lang === 'RU' ? 'Доходность' : 'Yield'}</span>
                </a>
                <a href="#defi" className="mobile-nav-btn" onClick={() => setIsMenuOpen(false)}>
                  <Zap size={22} />
                  <span>DEFI HUB</span>
                </a>
                <button 
                  className="mobile-nav-btn" 
                  onClick={() => { setIsModalOpen(true); setIsMenuOpen(false); }}
                >
                  <FileText size={22} />
                  <span>Whitepaper</span>
                </button>
                <a href="#nft" className="mobile-nav-btn" onClick={() => setIsMenuOpen(false)}>
                  <Wallet size={22} />
                  <span>{t.nav.nft}</span>
                </a>
                <a href="#tokenomics" className="mobile-nav-btn" onClick={() => setIsMenuOpen(false)}>
                  <BarChart3 size={22} />
                  <span>{t.nav.tokenomics}</span>
                </a>
                <a href="#roadmap" className="mobile-nav-btn" onClick={() => setIsMenuOpen(false)}>
                  <Mail size={22} />
                  <span>{t.nav.roadmap}</span>
                </a>
                <button 
                  className="mobile-nav-btn" 
                  onClick={() => setLang(lang === 'RU' ? 'EN' : 'RU')}
                >
                  <Globe size={22} />
                  <span>{lang === 'RU' ? 'RU / EN' : 'EN / RU'}</span>
                </button>
              </div>

              {/* Mobile Lang Switch moved outside the grid for better positioning */}
              <div className="mobile-menu-lang-switch">
                <div className="lang-switch">
                  <button className={`lang-btn ${lang === 'RU' ? 'active' : ''}`} onClick={() => setLang('RU')}>RU</button>
                  <button className={`lang-btn ${lang === 'EN' ? 'active' : ''}`} onClick={() => setLang('EN')}>EN</button>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FULLSCREEN CHART OVERLAY */}
      <AnimatePresence>
        {isChartFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="chart-overlay-fullscreen"
          >
            <div className="container modal-container-rel">
              <div className="chart-fullscreen-header">
                <h2 className="margin-0 color-accent-red">{translations[lang].defi.chartTitle} - GBU / AVAX</h2>
                <button 
                  onClick={() => setIsChartFullscreen(false)} 
                  className="btn-primary btn-close-red-pill"
                >
                  <Minimize2 size={20} className="margin-right-8" /> {lang === 'RU' ? 'ЗАКРЫТЬ' : 'CLOSE'}
                </button>
              </div>
              <div className="chart-fullscreen-content">
                {loadChart ? (
                  <iframe 
                    src={`https://dexscreener.com/avalanche/${GBU_ADDRESS}?embed=1&theme=dark&trades=0&info=0`}
                    className="chart-iframe-style"
                    title="GBU Chart"
                    loading="eager"
                  />
                ) : (
                  <div className="flex-column-center height-100-percent text-white">
                    {lang === 'RU' ? 'Подготовка графиков...' : 'Preparing charts...'}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default App;
