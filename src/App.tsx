import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, AreaChart, Area, XAxis, YAxis } from 'recharts';
import { Wallet, CheckCircle, BarChart3, X, MoreHorizontal, TrendingUp, Zap, Send, Mail } from 'lucide-react';
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
  url: 'https://granite-bear.vercel.app',
  icons: [`https://${window.location.host}/logo-main.jpg`]
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
  enableAnalytics: false,
  allWallets: 'SHOW', // Show all available wallets
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

// TELEGRAM NOTIFICATION CONFIG REMOVED
const GBU_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function burn(uint256 amount) public"
];

const USDT_ABI = [
  "function approve(address spender, uint256 amount) public returns (bool)",
  "function balanceOf(address account) view returns (uint256)",
  "function decimals() view returns (uint8)"
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
  const [scrolled, setScrolled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedCoin, setExpandedCoin] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
    priceUSD: 0.0524,
    priceChange: 12.4
  });

  const [newAvaxRate, setNewAvaxRate] = useState<number>(905);
  const [newUsdtRate, setNewUsdtRate] = useState<number>(16);

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
      price: 0.045 + Math.random() * 0.015
    }));
  });

  const [currentPrice, setCurrentPrice] = useState(0.0524);

  useEffect(() => {
    const interval = setInterval(() => {
      const lastPrice = chartData[chartData.length - 1].price;
      const change = (Math.random() - 0.45) * 0.002; // Slightly bias upward for demo
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
          const mainPair = data.pairs[0]; // Take the most liquid pair
          setDefiStats({
            volume24h: mainPair.volume.h24 || 0,
            liquidityUSD: mainPair.liquidity.usd || 0,
            priceUSD: parseFloat(mainPair.priceUsd) || 0,
            priceChange: mainPair.priceChange.h24 || 0
          });
          setCurrentPrice(parseFloat(mainPair.priceUsd) || 0.0524);
        }
      } catch (err) {
        console.warn("DexScreener API not ready or rate limited, using mock data...");
      }
    };

    fetchStats();
    const statsInterval = setInterval(fetchStats, 60000); // Update every minute
    return () => clearInterval(statsInterval);
  }, []);

  const updateBalance = async () => {
    if (!isConnected || !walletProvider || !address) {
      setBalance("0");
      return;
    }
    try {
      const provider = new BrowserProvider(walletProvider);
      const contract = new Contract(GBU_ADDRESS, GBU_ABI, provider);
      const bal = await contract.balanceOf(address);
      setBalance(formatUnits(bal, 18));

      // Check if owner and fetch stats
      if (address.toLowerCase() === "0x6c18c4ba7e3b4574dd70e2c2a81b0a18321d039f") {
        const usdtABI = ["function balanceOf(address) view returns (uint256)"];

        const avaxBal = await provider.getBalance(GBU_SALE_ADDRESS);
        const usdtContract = new Contract(USDT_ADDRESS, usdtABI, provider);
        const usdtBal = await usdtContract.balanceOf(GBU_SALE_ADDRESS);
        const gbuReserves = await contract.balanceOf(GBU_SALE_ADDRESS);

        setSaleStats({
          avaxBalance: parseFloat(formatUnits(avaxBal, 18)).toFixed(4),
          usdtBalance: formatUnits(usdtBal, 6),
          gbuStored: parseFloat(formatUnits(gbuReserves, 18)).toLocaleString(),
          isOwner: true
        });

        // Match rates if first fetch
        setNewAvaxRate(905);
        setNewUsdtRate(16);
      }
    } catch (err) {
      console.error("Error fetching balance:", err);
    }
  };

  const handleUpdateRates = async () => {
    if (!walletProvider) return;
    try {
      const provider = new BrowserProvider(walletProvider);
      const signer = await provider.getSigner();
      const saleContract = new Contract(GBU_SALE_ADDRESS, ["function setRates(uint256,uint256) external"], signer);
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
      const saleContract = new Contract(GBU_SALE_ADDRESS, ["function withdrawAll() external"], signer);
      const tx = await saleContract.withdrawAll();
      await tx.wait();
      alert(lang === 'RU' ? "Средства выведены!" : "Funds withdrawn!");
      updateBalance();
    } catch (err) {
      console.error("Withdraw failed:", err);
    }
  };

  const handleBuyWithAvax = async () => {
    if (!walletProvider || !purchaseAmt) return;
    setIsBurning(true); // Reusing isBurning for loading state
    try {
      const provider = new BrowserProvider(walletProvider);
      const signer = await provider.getSigner();
      const saleContract = new Contract(GBU_SALE_ADDRESS, ["function buyWithAvax() public payable"], signer);

      // Calculate AVAX spent based on 905 rate
      const avaxSpent = (purchaseAmt / newAvaxRate).toFixed(18);
      const tx = await saleContract.buyWithAvax({ value: parseEther(avaxSpent) });
      setBurnTxHash(tx.hash);
      await tx.wait();
      updateBalance();
      alert(lang === 'RU' ? "Покупка успешно завершена!" : "Purchase successful!");
    } catch (err) {
      console.error("Buy failed:", err);
    } finally {
      setIsBurning(false);
    }
  };

  const handleBuyWithUsdt = async () => {
    if (!walletProvider || !purchaseAmt) return;
    setIsBurning(true);
    try {
      const provider = new BrowserProvider(walletProvider);
      const signer = await provider.getSigner();
      
      const usdtContract = new Contract(USDT_ADDRESS, USDT_ABI, signer);
      const saleContract = new Contract(GBU_SALE_ADDRESS, ["function buyWithUsdt(uint256 usdtAmount) public"], signer);

      // USDT has 6 decimals, calculate amount to spend based on rate
      const usdtSpent = (purchaseAmt / newUsdtRate).toFixed(6);
      const parsedUsdtAmount = parseUnits(usdtSpent, 6);

      // 1. Approve USDT Spend
      const approveTx = await usdtContract.approve(GBU_SALE_ADDRESS, parsedUsdtAmount);
      await approveTx.wait();

      // 2. Buy GBU with USDT
      const buyTx = await saleContract.buyWithUsdt(parsedUsdtAmount);
      setBurnTxHash(buyTx.hash);
      await buyTx.wait();

      updateBalance();
      alert(lang === 'RU' ? "Покупка успешно завершена!" : "Purchase successful!");
    } catch (err) {
      console.error("USDT Buy failed:", err);
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
                <button
                  onClick={(e) => { e.stopPropagation(); addTokenToWallet(); }}
                  className="btn-add-token"
                >
                  +
                </button>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '4px', textAlign: 'center', letterSpacing: '0.05em' }}>
                ПРЯМОЙ ОБМЕН: AVAX | USDT (Avalanche)
              </span>
              <button className="btn-primary" onClick={() => open()} style={{ width: '100%' }}>
                <Wallet size={16} />
                <span className="btn-text">
                  {isConnected && address ? `${address.slice(0, 4)}...${address.slice(-3)}` : t.connectWallet}
                </span>
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

          <div className="defi-grid" style={{ alignItems: 'stretch' }}>
            {/* Chart Block - Transparent with bottom glow */}
            <div className="defi-transparent-card" style={{ padding: '30px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{t.defi.chartTitle}</h3>
                <div className="live-indicator">
                  <div className="dot"></div>
                  LIVE
                </div>
              </div>

              <div className="chart-wrapper-internal" style={{ height: '300px', background: 'rgba(5, 5, 16, 0.4)', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--glass-border)', padding: '15px' }}>
                <div style={{ marginBottom: '15px', display: 'flex', gap: '20px' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>GBU / AVAX</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--accent-red)' }}>
                      ${currentPrice.toFixed(4)}
                      <span style={{ fontSize: '0.8rem', color: defiStats.priceChange >= 0 ? '#00ff88' : '#ff3b3f', marginLeft: '8px' }}>
                        {defiStats.priceChange > 0 ? '+' : ''}{defiStats.priceChange}%
                      </span>
                    </div>
                  </div>
                  <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                    <TrendingUp color={defiStats.priceChange >= 0 ? "#00ff88" : "#ff3b3f"} size={24} />
                  </div>
                </div>

                <ResponsiveContainer width="100%" height="80%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--accent-red)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="var(--accent-red)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" hide />
                    <YAxis domain={['auto', 'auto']} hide />
                    <RechartsTooltip
                      contentStyle={{ background: '#050510', border: '1px solid var(--accent-red)', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                      labelStyle={{ display: 'none' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="price"
                      stroke="var(--accent-red)"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorPrice)"
                      animationDuration={1500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Right Column with two equal blocks */}
            <div className="defi-actions-column">
              {/* Buy Block */}
              <div className="defi-transparent-card defi-sub-card" style={{ padding: '20px' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', color: 'var(--accent-red)', marginTop: 0 }}>{t.defi.buyTitle}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '10px 0 20px' }}>{t.defi.buyDesc}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <a href={`https://traderjoexyz.com/avalanche/trade?inputCurrency=AVAX&outputCurrency=${GBU_ADDRESS}`} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ width: '100%', justifyContent: 'center', borderRadius: '50px', overflow: 'hidden' }}>
                    <TrendingUp size={18} style={{ marginRight: '8px' }} /> TraderJoe (DEX)
                  </a>
                  <a href={`https://dexscreener.com/avalanche/${GBU_ADDRESS}`} target="_blank" rel="noopener noreferrer" className="btn-social" style={{ width: '100%', justifyContent: 'center', borderRadius: '50px', overflow: 'hidden' }}>
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
                <a href={`https://snowtrace.io/token/${GBU_ADDRESS}`} target="_blank" rel="noopener noreferrer" className="btn-social" style={{ width: '100%', borderColor: 'var(--accent-gold)', color: 'var(--accent-gold)', justifyContent: 'center', borderRadius: '50px', overflow: 'hidden' }}>
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
                <h3 style={{ fontSize: '1.2rem', color: 'var(--accent-red)' }}>{t.defi.sale.title}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t.defi.sale.desc}</p>
              </div>

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
                <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                  <button 
                    onClick={() => setPaymentCurrency('AVAX')}
                    style={{ 
                      flex: 1, 
                      padding: '10px', 
                      borderRadius: '8px', 
                      background: paymentCurrency === 'AVAX' ? 'rgba(232, 65, 66, 0.2)' : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${paymentCurrency === 'AVAX' ? 'var(--accent-red)' : 'transparent'}`,
                      color: paymentCurrency === 'AVAX' ? 'white' : 'var(--text-muted)'
                    }}>
                    AVAX
                  </button>
                  <button 
                    onClick={() => setPaymentCurrency('USDT')}
                    style={{ 
                      flex: 1, 
                      padding: '10px', 
                      borderRadius: '8px', 
                      background: paymentCurrency === 'USDT' ? 'rgba(38, 161, 123, 0.2)' : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${paymentCurrency === 'USDT' ? '#26A17B' : 'transparent'}`,
                      color: paymentCurrency === 'USDT' ? 'white' : 'var(--text-muted)'
                    }}>
                    USDT
                  </button>
                </div>

                <label htmlFor="drawer-buy-amt" style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>{t.defi.sale.inputLabel}</label>
                <input
                  id="drawer-buy-amt"
                  type="number"
                  value={purchaseAmt}
                  onChange={(e) => setPurchaseAmt(Number(e.target.value))}
                  placeholder="100"
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '15px', color: 'white', borderRadius: '12px', fontSize: '1.1rem' }}
                />
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px', textAlign: 'center' }}>
                  {paymentCurrency === 'AVAX' 
                    ? `${t.defi.sale.rateInfo} | ~${(purchaseAmt / newAvaxRate).toFixed(3)} AVAX`
                    : `Rate: ${newUsdtRate} GBU per USDT | ~${(purchaseAmt / newUsdtRate).toFixed(2)} USDT`
                  }
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
                    ? 'Processing...' 
                    : (paymentCurrency === 'USDT' ? (lang === 'RU' ? 'Купить за USDT' : 'Buy with USDT') : t.defi.sale.buyAvax)
                  }
                </button>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="btn-bw"
                  style={{ width: '100%', height: '50px' }}
                >
                  {lang === 'RU' ? 'Закрыть' : 'Close'}
                </button>
              </div>

              {/* ADMIN PANEL INSIDE DRAWER */}
              {saleStats.isOwner && (
                <div className="glass-card" style={{ marginTop: '30px', border: '1px solid var(--accent-gold)', borderStyle: 'dashed' }}>
                  <h3 style={{ fontSize: '0.9rem', color: 'var(--accent-gold)', marginBottom: '15px', textAlign: 'center' }}>
                    {t.defi.sale.admin.title}
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                    <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{t.defi.sale.admin.profitAvax}</div>
                      <div style={{ fontWeight: 'bold' }}>{saleStats.avaxBalance}</div>
                    </div>
                    <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{t.defi.sale.admin.reservesGbu}</div>
                      <div style={{ fontWeight: 'bold' }}>{saleStats.gbuStored}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div>
                        <label style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{t.defi.sale.admin.rateAvaxLabel}</label>
                        <input
                          type="number"
                          value={newAvaxRate}
                          onChange={(e) => setNewAvaxRate(Number(e.target.value))}
                          style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '8px', color: 'white', borderRadius: '8px', marginTop: '4px' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{t.defi.sale.admin.rateUsdtLabel}</label>
                        <input
                          type="number"
                          value={newUsdtRate}
                          onChange={(e) => setNewUsdtRate(Number(e.target.value))}
                          style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '8px', color: 'white', borderRadius: '8px', marginTop: '4px' }}
                        />
                      </div>
                    </div>

                    <button onClick={handleUpdateRates} className="btn-gold" style={{ width: '100%', padding: '12px', fontSize: '0.8rem' }}>
                      {t.defi.sale.admin.btnUpdate}
                    </button>

                    <button onClick={handleWithdrawFunds} className="btn-primary" style={{ width: '100%', padding: '12px', fontSize: '0.8rem', background: '#27ae60' }}>
                      {t.defi.sale.admin.btnWithdraw}
                    </button>
                  </div>
                </div>
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

    </div >
  );
}

export default App;
