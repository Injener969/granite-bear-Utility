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
            ]
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
            buyDesc: "Приобретайте токены на TraderJoe или через наш виджет.",
            liquidityTitle: "Добавить Ликвидность",
            liquidityDesc: "Станьте поставщиком ликвидности и получайте часть комиссий от каждой сделки.",
            chartTitle: "График GBU/AVAX",
            buyAnalytics: "DexScreener (Аналитика)",
            stats: {
                volume: "Объем (24ч)",
                liquidity: "Ликвидность",
                marketcap: "Капитализация"
            },
            sale: {
                title: "ПРЯМАЯ ПОКУПКА / ПОПОЛНЕНИЕ",
                desc: "Официальный смарт-контракт для покупки GBU напрямую за AVAX.",
                inputLabel: "Сумма покупки (токенов):",
                rateInfo: "Цена: $0.06 | Курс GBU/AVAX: 905",
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
            content: `
        <p><strong>Версия:</strong> 1.0<br/><strong>Сеть:</strong> Avalanche (C-Chain) | <strong>Сектор:</strong> RWA / DeFi / Утилитарные программы лояльности</p>
        
        <h3>1. Введение (Abstract)</h3>
        <p>Современный криптовалютный рынок перенасыщен спекулятивными активами, не имеющими фундаментальной ценности. В то же время реальный сектор экономики (в частности, добыча и обработка природного камня) сталкивается с инфляционными издержками, где цены на материалы растут на 6–9% ежегодно.</p>
        <p>Granite Bear Utility (GBU) решает обе проблемы, создавая мост между Web3-технологиями и реальным производством. Проект представляет собой децентрализованную утилитарную экосистему на блокчейне Avalanche, где токен GBU выступает цифровым ключом к получению скидок и фиксации цен на премиальные гранитные изделия. Покупая гранит за фиатные средства, клиенты используют GBU для активации скидки, что приводит к безвозвратному сжиганию токенов и формированию математически обоснованного дефицита.</p>

        <h3>2. Анализ рынка и Проблема</h3>
        <p><strong>Проблема реального сектора:</strong> Строительные компании и B2B-заказчики страдают от волатильности цен на стройматериалы. Традиционные контракты редко позволяют зафиксировать цену на долгий срок без огромных предоплат.</p>
        <p><strong>Проблема крипторынка:</strong> Инвесторы ищут проекты сектора RWA (Real World Assets), но большинство из них сталкиваются с юридическими барьерами, пытаясь напрямую продавать товары за токены, что нарушает законы о ЦФА и платежных средствах.</p>
        <p><strong>Решение Granite Bear Utility:</strong> Мы не продаем гранит за криптовалюту. Товар покупается за фиат (рубли, доллары). Токен GBU работает исключительно как криптографический купон программы лояльности.</p>

        <h3>3. Механика экосистемы</h3>
        <p>Экосистема базируется на Web3-дашборде, который синхронизируется с CRM-системой производства.</p>
        <p><strong>Сценарий использования:</strong></p>
        <ol>
          <li>Заказчик хочет приобрести партию гранита (брусчатка, бордюры, плиты).</li>
          <li>Для получения скидки заказчик приобретает GBU на децентрализованной бирже (DEX).</li>
          <li>Через Web3-дашборд заказчик отправляет токены на смарт-контракт.</li>
          <li>Оракул (Chainlink) фиксирует курс, смарт-контракт верифицирует долларовый эквивалент и навсегда сжигает токены.</li>
          <li>Заказчик получает фиатную скидку до 20% и фиксацию прайса.</li>
        </ol>

        <h3>4. Дефляционная модель и Математика сжигания</h3>
        <p>Для защиты от волатильности используются фиксированные фиатные пороги сжигания:</p>
        <ul>
          <li><strong>Базовый ($100):</strong> Скидка 5%, фиксация цены на 1 мес.</li>
          <li><strong>Продвинутый ($300):</strong> Скидка 10%, фиксация цены на 3 мес.</li>
          <li><strong>Pro B2B ($600):</strong> Скидка 15%, приоритет в логистике.</li>
          <li><strong>VIP NFT ($900+):</strong> Скидка 20%, персональный менеджер.</li>
        </ul>

        <h3>5. Механика подтверждения (Proof of Burn)</h3>
        <p>После транзакции сжигания Web3-дашборд генерирует уникальный <strong>Верификационный Код</strong>. Этот код связывает транзакцию в блокчейне с конкретным заказом.</p>
        <p><strong>Пример подтверждения для продавца:</strong></p>
        <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; border: 1px dashed #D4AF37; margin: 10px 0;">
          <p style="margin: 0; font-family: monospace;">
            ACCOUNT: 0x71C...49FD (Ваш кошелек)<br/>
            STATUS: Burned 12,400 GBU ($600 Equiv.)<br/>
            <strong>DISCOUNT CODE: GBU-X5R2-49FD</strong>
          </p>
        </div>
        <p>Предъявите этот код при оформлении заказа за фиат, и менеджер верифицирует вашу скидку в блокчейне.</p>

        <h3>6. Токеномика</h3>
        <p>Управление эмиссией построено на принципах защиты ликвидности. Возможен только процесс сжигания (Burn). Максимальная эмиссия: 969,000,000 GBU.</p>

        <h3>6. Granite Club: NFT Интеграция</h3>
        <p>В экосистему интегрирована строго лимитированная NFT-коллекция (до 500 единиц) "Granite Bear Utility Bears". Эта статусная коллекция предоставляет пожизненный доступ к VIP-скидкам, DeFi буст (+10% APY) и физическую статуэтку медведя из гранита.</p>

        <h3>7. Технологическая архитектура</h3>
        <p>Выбор сети Avalanche обусловлен ее архитектурными преимуществами: Скорость и масштабируемость (4500+ TPS), Мгновенная финальность (&lt; 2 сек) и Низкие комиссии (Gas ~$0.01).</p>
        
        <h3>8. Юридический отказ от ответственности (Disclaimer)</h3>
        <p><small>Токен GBU является исключительно утилитарным криптографическим токеном (Utility Token), предназначенным для взаимодействия с экосистемой Granite Bear Utility. GBU не является ценной бумагой, инвестиционным контрактом, долей в компании или платежным средством. Участие в проекте означает полное принятие пользователем всех возможных финансовых и технических рисков.</small></p>
      `
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
            ]
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
            buyDesc: "Acquire tokens on TraderJoe or through our widget.",
            liquidityTitle: "Add Liquidity",
            liquidityDesc: "Become a liquidity provider and earn a share of the fees from every trade.",
            chartTitle: "GBU/AVAX Chart",
            buyAnalytics: "DexScreener (Analytics)",
            stats: {
                volume: "Volume (24h)",
                liquidity: "Liquidity",
                marketcap: "Market Cap"
            },
            sale: {
                title: "PRE-SALE / GBU REFILL",
                desc: "Official smart-contract for direct GBU purchase using AVAX.",
                inputLabel: "Purchase Amount (tokens):",
                rateInfo: "Price: $0.06 | GBU/AVAX rate: 905",
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
            content: `
        <p><strong>Version:</strong> 1.0<br/><strong>Network:</strong> Avalanche (C-Chain) | <strong>Sector:</strong> RWA / DeFi / Utility Loyalty Programs</p>
        
        <h3>1. Abstract</h3>
        <p>The modern cryptocurrency market is oversaturated with speculative assets lacking fundamental value. At the same time, the real economy sector (particularly the extraction and processing of natural stone) faces inflationary costs, where material prices rise by 6–9% annually.</p>
        <p>Granite Bear (GBU) solves both problems by creating a bridge between Web3 technologies and real production. The project is a decentralized utility ecosystem on the Avalanche blockchain, where the GBU token serves as a digital key to discounts and price locking on premium granite products.</p>

        <h3>2. Market Analysis and Problem</h3>
        <p><strong>Problem:</strong> Construction companies and B2B clients suffer from building material price volatility. Most RWA projects face high regulatory barriers trying to sell goods for crypto directly.</p>
        <p><strong>Solution:</strong> We do not sell granite for crypto. Goods are paid in fiat, while the GBU token functions strictly as a cryptographic loyalty coupon to activate discounts.</p>

        <h3>3. Ecosystem Mechanics</h3>
        <p><strong>Scenario:</strong></p>
        <ol>
          <li>Client buys GBU on a DEX to secure a discount on a granite batch.</li>
          <li>Through the Web3 Dashboard, they send tokens to the smart contract.</li>
          <li>A Chainlink Oracle captures the price, the contract verifies the USD equivalent and permanently burns the tokens.</li>
          <li>Client receives up to a 20% fiat discount and price fixation.</li>
        </ol>

        <h3>4. Deflationary Model & Burn Math</h3>
        <p>Fixed fiat thresholds are used to protect users from market volatility:</p>
        <ul>
          <li><strong>Basic ($100):</strong> 5% discount, 1-mo price lock.</li>
          <li><strong>Advanced ($300):</strong> 10% discount, 3-mo price lock.</li>
          <li><strong>Pro B2B ($600):</strong> 15% discount, priority logistics.</li>
          <li><strong>VIP NFT ($900+):</strong> 20% discount, personal manager.</li>
        </ul>

        <h3>5. Verification Mechanism (Proof of Burn)</h3>
        <p>After the burn transaction, the Web3 Dashboard generates a unique <strong>Verification Code</strong>. This code links the blockchain transaction to a specific order.</p>
        <p><strong>Example confirmation for the seller:</strong></p>
        <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; border: 1px dashed #D4AF37; margin: 10px 0;">
          <p style="margin: 0; font-family: monospace;">
            ACCOUNT: 0x71C...49FD (Client Wallet)<br/>
            STATUS: Burned 12,400 GBU ($600 Equiv.)<br/>
            <strong>DISCOUNT CODE: GBU-X5R2-49FD</strong>
          </p>
        </div>
        <p>Present this code when paying for your order in fiat, and the manager will verify your discount on the blockchain.</p>

        <h3>6. Tokenomics</h3>
        <p>Emission management favors liquidity protection. Only the Burn process is possible. Hard Cap: 969,000,000 GBU.</p>

        <h3>6. Granite Club: NFT Integration</h3>
        <p>Strictly limited to 500 units, the "Granite Bear Utility Bears" NFT grants lifetime VIP discounts, a DeFi boost (+10% APY), and a physical granite bear statue.</p>

        <h3>7. Architecture</h3>
        <p>Avalanche was chosen for scalability (4500+ TPS), instant finality (&lt;2s), and low fees (~$0.01).</p>
        
        <h3>8. Legal Disclaimer</h3>
        <p><small>GBU is strictly a Utility Token. It is not a security, investment contract, or legal tender. Participation signifies full acceptance of all technical and financial risks.</small></p>
      `
        }
    }
};
