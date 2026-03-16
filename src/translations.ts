export const translations = {
    RU: {
        nav: {
            about: "О проекте",
            tokenomics: "Токеномика",
            loyalty: "Скидки",
            nft: "NFT Клуб",
            roadmap: "Дорожная карта",
        },
        connectWallet: "Подключить кошелек",
        balance: "Баланс",
        walletConnected: "Кошелек подключен",
        walletHelp: {
            title: "Как подключить кошелек?",
            subtitle: "Следуйте инструкции, чтобы начать работу с Web3:",
            step1: "1. Установите MetaMask (расширение для браузера или мобильное приложение).",
            step2: "2. Переключитесь на сеть Avalanche (сайт предложит сделать это автоматически).",
            step3: "3. Нажмите кнопку 'Подключить' и подтвердите запрос в кошельке.",
            mobileTip: "Если вы на телефоне, открывайте сайт через встроенный браузер внутри приложения MetaMask!",
            close: "Понятно"
        },
        hero: {
            title: "Токенизация реального сектора. Твой цифровой ключ к гранитной империи.",
            subtitle: "Дефляционный утилитарный токен GBU на блокчейне Avalanche. Зафиксируй цену на гранит и получи скидку до 15% за счет смарт-сжигания.",
            buyBtn: "Купить GBU",
            wpBtn: "Whitepaper",
        },
        stats: {
            tps: "TPS Avalanche",
            price: "Цена GBU",
            burned: "Сожжено GBU",
            supply: "Эмиссия",
            gbuUniversal: "GBU Универсальный",
            chains: [
                { name: 'Exchange Chain', desc: 'X (Обмен)' },
                { name: 'Contract Chain', desc: 'C (Смарт-контр.)' },
                { name: 'Platform Chain', desc: 'P (Стейкинг)' }
            ]
        },
        about: {
            title: "Реальная польза. Реальная дефляция.",
            card1: { title: "1. Купи GBU", desc: "Свободная торговля на DEX Avalanche. Быстро, с минимальными комиссиями." },
            card2: { title: "2. Активируй скидку", desc: "Выбери партию гранита за фиат и оплати часть стоимости токенами." },
            card3: { title: "3. Сжигание и Рост", desc: "Использованные GBU навсегда сгорают, сокращая сапплай." }
        },
        tokenomics: {
            title: "GBU (Granite Bear Utility) Tokenomics",
            subtitle: "Максимальное предложение 969,000,000 GBU. Без дополнительной эмиссии.",
            tableTitle: ["Категория", "Доля", "Объем (GBU)"],
            items: [
                { name: 'DeFi и Стейкинг', percent: '30%', amount: '290,700,000' },
                { name: 'Пул ликвидности (DEX)', percent: '25%', amount: '242,250,000' },
                { name: 'Команда и Разработка', percent: '15%', amount: '145,350,000' },
                { name: 'Маркетинг и Партнеры', percent: '15%', amount: '145,350,000' },
                { name: 'Программа лояльности', percent: '15%', amount: '145,350,000' }
            ],
            stats: {
                liquidity: "Ликвидность",
                liquidityVal: "Заблокировано",
                burned: "Сожжено",
                holders: "Холдеры"
            }
        },
        loyalty: {
            title: "Уровни лояльности",
            burnEquivalent: "Сжигание эквивалента",
            discountPrefix: "Скидка",
            levels: [
                { name: "Базовый", burn: "$100", discount: "5%", fix: "Фиксация на 1 мес" },
                { name: "Продвинутый", burn: "$300", discount: "10%", fix: "Фиксация на 3 мес" },
                { name: "Pro (B2B)", burn: "$600", discount: "15%", fix: "Приоритетная логистика" },
                { name: "VIP (NFT Club)", burn: "$900+", discount: "20%", fix: "Фиксация 6 мес + Менеджер" }
            ],
            tableTitle: ["Уровень (Tier)", "Сжигание (Экв.)", "Скидка", "Доп. полезность"],
            dashboardBtn: "СЖЕЧЬ GBU И ПОЛУЧИТЬ СКИДКУ"
        },
        nft: {
            title: "CLUB GBU NFT",
            subtitle: "Лимитированная коллекция (100-500 NFT) для крупных игроков и инвесторов.",
            benefits: [
                "Постоянный доступ к VIP-скидке (20%)",
                "+10% APY в стейкинге",
                "Приоритет на логистику",
                "Физическая фигурка из гранита"
            ],
            btn: "Попасть в Whitelist",
            cardType: "Premium Grade",
            waitlist: {
                placeholder: "Ваш Email или Telegram",
                submit: "Присоединиться",
                success: "Заявка отправлена! Ждите новостей."
            }
        },
        features: {
            title: "Инструменты доходности",
            staking: { title: "Стейкинг (APY 15-25%)", desc: "Блокируйте свои токены GBU для получения стабильного пассивного дохода." },
            farming: { title: "LP Фарминг (RWA пул)", desc: "Повышенные вознаграждения для поставщиков ликвидности в паре GBU/AVAX." },
            boost: { title: "NFT-Бустер (x1.5)", desc: "Владение Granite Bear NFT ускоряет вашу доходность во всей экосистеме." }
        },
        roadmap: {
            title: "Дорожная карта",
            phases: [
                { title: "Фаза 1: Запуск", desc: "Запуск смарт-контрактов, листинг на DEX, релиз сайта." },
                { title: "Фаза 2: Механика", desc: "Запуск Web3 Дашборда для скидок, старт механизма сжигания." },
                { title: "Фаза 3: Интеграция", desc: "Минт NFT Granite Club, подключение ценовых оракулов." },
                { title: "Фаза 4: Экспансия и B2B", desc: "Партнерство с производителями B2B. Интеграция моста CRM. Подготовка к масштабируемости." },
                { title: "Фаза 5: Глобальная Экосистема", desc: "Листинг на биржах уровня Tier-1 (CEX). Полномасштабная интеграция RWA-активов по всему миру." }
            ]
        },
        defi: {
            title: "DeFi Hub & Ликвидность",
            subtitle: "Торгуйте GBU с минимальными комиссиями в сети Avalanche. Прямая связь с основными DEX.",
            buyTitle: "Купить GBU",
            buyDesc: "Приобретайте токены на LFJ или через наш виджет.",
            liquidityTitle: "Добавить Ликвидность",
            liquidityDesc: "Станьте поставщиком ликвидности и получайте часть комиссий от каждой сделки.",
            chartTitle: "График GBU/AVAX",
            marketHub: "Market Hub",
            transparencyTitle: "Прозрачность",
            transparencyDesc: "Контракт GBU прошел проверку. Все транзакции открыты для аудита в Snowtrace.",
            snowtrace: "Snowtrace (Explorer)",
            buyAnalytics: "DexScreener (Аналитика)",
            dexHelp: "Если GBU не отображается на бирже: 1. Скопируйте адрес контракта из подвала сайта. 2. Вставьте его в поиск токенов на LFJ. 3. Нажмите 'Import'.",
            stats: {
                volume: "Объем (24ч)",
                liquidity: "Ликвидность",
                marketcap: "Капитализация"
            },
            connectWallet: "Подключить кошелек",
            sale: {
                title: "ПРЯМАЯ ПОКУПКА / ПОПОЛНЕНИЕ",
                desc: "Официальный смарт-контракт для покупки GBU напрямую за AVAX.",
                inputLabel: "Сумма покупки (токенов):",
                rateInfo: "Цена: $0.06 | Курс GBU/AVAX: 166",
                buyAvax: "КУПИТЬ GBU (AVAX)",
                disconnect: "ОТКЛЮЧИТЬ КОШЕЛЕК",
                successTitle: "ОПЛАТА ПРОШЛА УСПЕШНО!",
                buySuccess: "Вы успешно приобрели токены GBU. Они скоро появятся в вашем кошельке.",
                viewOnExplorer: "Посмотреть транзакцию",
                backToSite: "ВЕРНУТЬСЯ НА САЙТ",
                admin: {
                    title: "🛠 ПАНЕЛЬ УПРАВЛЕНИЯ (ADMIN)",
                    profitAvax: "Прибыль (AVAX)",
                    reservesGbu: "В резерве (GBU)",
                    rateAvaxLabel: "Курс AVAX (GBU за 1 AVAX)",
                    rateUsdtLabel: "Курс USDT (GBU за 1 USDT)",
                    btnUpdate: "ОБНОВИТЬ КУРСЫ",
                    btnWithdraw: "ВЫВЕСТИ ВСЮ ПРИБЫЛЬ"
                }
            }
        },
        footer: {
            contractLabel: "Контракт GBU",
            copyBtn: "Копировать",
            disclaimer: "Криптоактивы подвержены высокой волатильности. GBU не является ценной бумагой и не обеспечен физическим гранитом напрямую. Проводите собственное исследование перед инвестированием.",
            copyright: "© 2026 Granite Bear Utility. Все права защищены.",
            terms: "Пользовательское соглашение",
            privacy: "Политика конфиденциальности",
            social: {
                telegram: "https://t.me/GraniteBear",
                twitter: "https://x.com/InjenerKarelin",
                email: "mailto:admin@gbutoken.xyz"
            }
        },
        whitepaperModal: {
            title: "WHITEPAPER: Granite Bear Utility (GBU)",
            close: "Закрыть",
        }
    },
    EN: {
        nav: {
            about: "About",
            tokenomics: "Tokenomics",
            loyalty: "Discounts",
            nft: "NFT Club",
            roadmap: "Roadmap",
        },
        connectWallet: "Connect Wallet",
        balance: "Balance",
        walletConnected: "Wallet Connected",
        walletHelp: {
            title: "How to connect wallet?",
            subtitle: "Follow these steps to start working with Web3:",
            step1: "1. Install MetaMask (browser extension or mobile app).",
            step2: "2. Switch to Avalanche network (the site will ask automatically).",
            step3: "3. Click 'Connect' and confirm the request in your wallet.",
            mobileTip: "If you're on mobile, open this site using the browser inside the MetaMask app!",
            close: "Got it"
        },
        hero: {
            title: "Real Sector Tokenization. Your Digital Key to the Granite Empire.",
            subtitle: "GBU deflationary utility token on Avalanche. Lock your granite price and get up to 20% discount through smart-burning.",
            buyBtn: "Buy GBU",
            wpBtn: "Whitepaper",
        },
        stats: {
            tps: "Avalanche TPS",
            price: "GBU Price",
            burned: "GBU Burned",
            supply: "Total Supply",
            gbuUniversal: "GBU Universal",
            chains: [
                { name: 'Exchange Chain', desc: 'X (Exchange)' },
                { name: 'Contract Chain', desc: 'C (Contracts)' },
                { name: 'Platform Chain', desc: 'P (Staking)' }
            ]
        },
        about: {
            title: "Real Utility. Real Deflation.",
            card1: { title: "1. Buy GBU", desc: "Free trading on Avalanche DEX. Fast, with minimal fees." },
            card2: { title: "2. Activate Discount", desc: "Select a batch of granite for fiat and pay part of the cost with tokens." },
            card3: { title: "3. Burn & Grow", desc: "Used GBU is burned forever, reducing the supply." }
        },
        tokenomics: {
            title: "GBU (Granite Bear Utility) Tokenomics",
            subtitle: "Maximum supply 969,000,000 GBU. No additional emission.",
            tableTitle: ["Category", "Share", "Volume (GBU)"],
            items: [
                { name: 'DeFi & Staking', percent: '30%', amount: '290,700,000' },
                { name: 'Liquidity Pool (DEX)', percent: '25%', amount: '242,250,000' },
                { name: 'Team & Development', percent: '15%', amount: '145,350,000' },
                { name: 'Marketing & Partners', percent: '15%', amount: '145,350,000' },
                { name: 'Loyalty Program', percent: '15%', amount: '145,350,000' }
            ],
            stats: {
                liquidity: "Liquidity",
                liquidityVal: "Locked",
                burned: "Burned",
                holders: "Holders"
            }
        },
        loyalty: {
            title: "Loyalty Tiers",
            burnEquivalent: "Burn Equivalent",
            discountPrefix: "Discount",
            levels: [
                { name: "Basic", burn: "$100", discount: "5%", fix: "Price lock 1 mo" },
                { name: "Advanced", burn: "$300", discount: "10%", fix: "Price lock 3 mo" },
                { name: "Pro (B2B)", burn: "$600", discount: "15%", fix: "Priority logistics" },
                { name: "VIP (NFT Club)", burn: "$900+", discount: "20%", fix: "Lock 6 mo + Manager" }
            ],
            tableTitle: ["Tier", "Burn (Eqv.)", "Discount", "Extra Utility"],
            dashboardBtn: "BURN GBU AND GET DISCOUNT"
        },
        nft: {
            title: "CLUB GBU NFT",
            subtitle: "Limited collection (100-500 NFT) for major players and investors.",
            benefits: [
                "Lifetime VIP discount (20%) access",
                "+10% APY in staking",
                "Priority logistics",
                "Physical granite figure drop"
            ],
            btn: "Join Whitelist",
            cardType: "Premium Grade",
            waitlist: {
                placeholder: "Your Email or Telegram",
                submit: "Join",
                success: "Request sent! Stay tuned."
            }
        },
        features: {
            title: "Yield Instruments",
            staking: { title: "Staking (APY 15-25%)", desc: "Lock your GBU tokens to earn stable passive income from the network." },
            farming: { title: "LP Farming (RWA Pool)", desc: "Higher rewards for liquidity providers in the GBU/AVAX pair." },
            boost: { title: "NFT-Booster (x1.5)", desc: "Owning a Granite Bear NFT accelerates your earnings across the ecosystem." }
        },
        roadmap: {
            title: "Roadmap",
            phases: [
                { title: "Phase 1: Launch", desc: "Smart contracts launch, DEX listing, website release." },
                { title: "Phase 2: Mechanics", desc: "Web3 Dashboard launch for discounts, start burning mechanism." },
                { title: "Phase 3: Integration", desc: "Granite Club NFT mint, price oracles connection." },
                { title: "Phase 4: Expansion & B2B", desc: "Partnership with B2B producers. CRM bridge integration. Scalability preparation." },
                { title: "Phase 5: Global Ecosystem", desc: "Tier-1 CEX listings. Full-scale global RWA asset integration." }
            ]
        },
        defi: {
            title: "DeFi Hub & Liquidity",
            subtitle: "Trade GBU with minimal fees on the Avalanche network. Direct connection to major DEXs.",
            buyTitle: "Buy GBU",
            buyDesc: "Acquire tokens on LFJ or through our widget.",
            liquidityTitle: "Add Liquidity",
            liquidityDesc: "Become a liquidity provider and earn a share of the fees from every trade.",
            chartTitle: "GBU/AVAX Chart",
            marketHub: "Market Hub",
            transparencyTitle: "Transparency",
            transparencyDesc: "GBU contract is verified. All transactions are open for audit on Snowtrace.",
            snowtrace: "Snowtrace (Explorer)",
            buyAnalytics: "DexScreener (Analytics)",
            dexHelp: "If GBU is not visible: 1. Copy contract address from the footer. 2. Paste it into the search on LFJ. 3. Click 'Import'.",
            stats: {
                volume: "Volume (24h)",
                liquidity: "Liquidity",
                marketcap: "Market Cap"
            },
            connectWallet: "Connect Wallet",
            sale: {
                title: "PRE-SALE / GBU REFILL",
                desc: "Official smart-contract for direct GBU purchase using AVAX.",
                inputLabel: "Purchase Amount (tokens):",
                rateInfo: "Price: $0.06 | GBU/AVAX rate: 166",
                buyAvax: "BUY GBU (AVAX)",
                disconnect: "DISCONNECT WALLET",
                successTitle: "PURCHASE SUCCESSFUL!",
                buySuccess: "You have successfully purchased GBU tokens. They will appear in your wallet shortly.",
                viewOnExplorer: "View Transaction",
                backToSite: "BACK TO SITE",
                admin: {
                    title: "🛠 ADMIN CONTROL PANEL",
                    profitAvax: "Profit (AVAX)",
                    reservesGbu: "Stored (GBU)",
                    rateAvaxLabel: "AVAX Rate (GBU per 1 AVAX)",
                    rateUsdtLabel: "USDT Rate (GBU per 1 USDT)",
                    btnUpdate: "UPDATE RATES",
                    btnWithdraw: "WITHDRAW ALL PROFITS"
                }
            }
        },
        footer: {
            contractLabel: "GBU Contract",
            copyBtn: "Copy",
            disclaimer: "Crypto assets are subject to high volatility. GBU is not a security and is not directly backed by physical granite. Please do your own research (DYOR) before investing.",
            copyright: "© 2026 Granite Bear Utility. All Rights Reserved.",
            terms: "Terms of Service",
            privacy: "Privacy Policy",
            social: {
                telegram: "https://t.me/GraniteBear",
                twitter: "https://x.com/InjenerKarelin",
                email: "mailto:admin@gbutoken.xyz"
            }
        },
        whitepaperModal: {
            title: "WHITEPAPER: Granite Bear Utility (GBU)",
            close: "Close",
        }
    }
};
