import React from 'react';

interface WhitepaperContentProps {
  lang: 'RU' | 'EN';
}

const WhitepaperContent: React.FC<WhitepaperContentProps> = ({ lang }) => {
  if (lang === 'RU') {
    return (
      <>
        <p><strong>Версия:</strong> 1.0<br/><strong>Сеть:</strong> Avalanche (C-Chain) | <strong>Сектор:</strong> RWA / DeFi / Утилитарные программы лояльности</p>
        
        <h3>1. Введение (Abstract)</h3>
        <p>Современный криптовалютный рынок перенасыщен спекулятивными активами, не имеющими фундаментальной ценности. В то же время реальный сектор экономики (в частности, добыча и обработка природного камня) сталкивается с инфляционными издержками, где цены на материалы растут на 6–9% ежегодно.</p>
        <p>Granite Bear Utility (GBU) решает обе проблемы, создавая мост между Web3-технологиями и реальным производством. Проект представляет собой децентрализованную утилитарную экосистему на блокчейне Avalanche, где токен GBU выступает цифровым ключом к получению скидок и фиксации цен на премиальные гранитные изделия.</p>

        <h3>2. Анализ рынка и Проблема</h3>
        <p><strong>Проблема реального сектора:</strong> Строительные компании и B2B-заказчики страдают от волатильности цен на стройматериалы. Традиционные контракты редко позволяют зафиксировать цену на долгий срок без огромных предоплат.</p>
        <p><strong>Решение Granite Bear Utility:</strong> Мы не продаем гранит за криптовалюту. Товар покупается за фиат (рубли, доллары). Токен GBU работает исключительно как криптографический купон программы лояльности.</p>

        <h3>3. Механика экосистемы</h3>
        <ol>
          <li>Заказчик хочет приобрести партию гранита.</li>
          <li>Для получения скидки заказчик приобретает GBU на децентрализованной бирже (DEX).</li>
          <li>Через Web3-дашборд заказчик отправляет токены на смарт-контракт.</li>
          <li>Оракул (Chainlink) фиксирует курс, смарт-контракт верифицирует долларовый эквивалент и навсегда сжигает токены.</li>
          <li>Заказчик получает фиатную скидку до 20% и фиксацию прайса.</li>
        </ol>

        <h3>4. Дефляционная модель и Математика сжигания</h3>
        <ul>
          <li><strong>Базовый ($100):</strong> Скидка 5%, фиксация цены на 1 мес.</li>
          <li><strong>Продвинутый ($300):</strong> Скидка 10%, фиксация цены на 3 мес.</li>
          <li><strong>Pro B2B ($600):</strong> Скидка 15%, приоритет в логистике.</li>
          <li><strong>VIP NFT ($900+):</strong> Скидка 20%, персональный менеджер.</li>
        </ul>

        <h3>5. Механика подтверждения (Proof of Burn)</h3>
        <p>После транзакции сжигания Web3-дашборд генерирует уникальный <strong>Верификационный Код</strong>. Этот код связывает транзакцию в блокчейне с конкретным заказом.</p>
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '8px', border: '1px dashed #D4AF37', margin: '10px 0' }}>
          <p style={{ margin: 0, fontFamily: 'monospace' }}>
            ACCOUNT: 0x71C...49FD (Ваш кошелек)<br/>
            STATUS: Burned 12,400 GBU ($600 Equiv.)<br/>
            <strong>DISCOUNT CODE: GBU-X5R2-49FD</strong>
          </p>
        </div>

        <h3>6. Токеномика</h3>
        <p>Возможен только процесс сжигания (Burn). Максимальная эмиссия: 969,000,000 GBU.</p>

        <h3>7. Технологическая архитектура</h3>
        <p>Выбор сети Avalanche обусловлен ее архитектурными преимуществами: Масштабируемость (4500+ TPS) и Низкие комиссии (Gas ~$0.01).</p>
        
        <h3>8. Disclaimer</h3>
        <p><small>Токен GBU является исключительно утилитарным токеном. Он не является ценной бумагой или инвестиционным контрактом.</small></p>
      </>
    );
  }

  return (
    <>
      <p><strong>Version:</strong> 1.0<br/><strong>Network:</strong> Avalanche (C-Chain) | <strong>Sector:</strong> RWA / DeFi / Utility Loyalty Programs</p>
      
      <h3>1. Abstract</h3>
      <p>Granite Bear (GBU) creates a bridge between Web3 technologies and real production. The project is a decentralized utility ecosystem on the Avalanche blockchain, where the GBU token serves as a digital key to discounts and price locking on premium granite products.</p>

      <h3>2. Market Analysis and Problem</h3>
      <p><strong>Problem:</strong> Construction companies and B2B clients suffer from building material price volatility.</p>
      <p><strong>Solution:</strong> We do not sell granite for crypto. Goods are paid in fiat, while the GBU token functions strictly as a cryptographic loyalty coupon.</p>

      <h3>3. Ecosystem Mechanics</h3>
      <ol>
        <li>Client buys GBU on a DEX to secure a discount.</li>
        <li>Through the Web3 Dashboard, they send tokens to the smart contract.</li>
        <li>The contract verifies the USD equivalent and permanently burns the tokens.</li>
        <li>Client receives up to a 20% fiat discount and price fixation.</li>
      </ol>

      <h3>4. Deflationary Model & Burn Math</h3>
      <ul>
        <li><strong>Basic ($100):</strong> 5% discount, 1-mo price lock.</li>
        <li><strong>Advanced ($300):</strong> 10% discount, 3-mo price lock.</li>
        <li><strong>Pro B2B ($600):</strong> 15% discount, priority logistics.</li>
        <li><strong>VIP NFT ($900+):</strong> 20% discount, personal manager.</li>
      </ul>

      <h3>5. Verification Mechanism (Proof of Burn)</h3>
      <p>The Web3 Dashboard generates a unique <strong>Verification Code</strong> linking the blockchain transaction to a specific order.</p>
      <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '8px', border: '1px dashed #D4AF37', margin: '10px 0' }}>
        <p style={{ margin: 0, fontFamily: 'monospace' }}>
          ACCOUNT: 0x71C...49FD (Client Wallet)<br/>
          STATUS: Burned 12,400 GBU ($600 Equiv.)<br/>
          <strong>DISCOUNT CODE: GBU-X5R2-49FD</strong>
        </p>
      </div>

      <h3>6. Tokenomics</h3>
      <p>Hard Cap: 969,000,000 GBU. Deflationary model through burning.</p>

      <h3>7. Architecture</h3>
      <p>Avalanche was chosen for scalability (4500+ TPS), instant finality, and low fees (~$0.01).</p>
      
      <h3>8. Legal Disclaimer</h3>
      <p><small>GBU is strictly a Utility Token. It is not a security or investment contract.</small></p>
    </>
  );
};

export default WhitepaperContent;
