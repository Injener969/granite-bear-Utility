/* cSpell:disable */
import React from 'react';

interface WhitepaperContentProps {
  lang: 'RU' | 'EN';
}

const WhitepaperContent: React.FC<WhitepaperContentProps> = ({ lang }) => {
  if (lang === 'RU') {
    return (
      <>
        <h2 className="text-center">Whitepaper: Granite Bear Utility (GBU)</h2>
        <p><strong>Версия:</strong> 1.0 (Official Technical & Business Edition)<br/>
        <strong>Сеть:</strong> Avalanche (Интеграция X, P, C-Chain)<br/>
        <strong>Сектор:</strong> RWA (Real World Assets) / Цифровые программы лояльности</p>
        
        <h3>1. Введение (Abstract)</h3>
        <p>Granite Bear Utility (GBU) — это децентрализованная экосистема, объединяющая технологии Web3 с реальным производственным сектором (добыча и обработка природного камня). В основе проекта лежит создание «цифрового моста» для потребителей гранитных изделий (брусчатка, плиты, мемориалы).</p>
        <p>В условиях ежегодного удорожания природных ресурсов, GBU выступает как утилитарный цифровой бонус, позволяющий фиксировать стоимость продукции и получать привилегии через механизмы блокчейна Avalanche.</p>

        <h3>2. Технологическая универсальность (Avalanche Architecture)</h3>
        <p>Проект использует архитектуру трех цепей Avalanche, что делает обращение бонусов быстрым и дешевым:</p>
        <ul>
          <li><strong>C-Chain (Contract):</strong> Основная среда для смарт-контрактов, стейкинга и Web3-интерфейса.</li>
          <li><strong>X-Chain (Exchange):</strong> Среда для мгновенных и сверхдешевых переводов прав на скидку между участниками клуба.</li>
          <li><strong>P-Chain (Platform):</strong> Обеспечивает безопасность и масштабируемость системы для крупных B2B-партнеров.</li>
        </ul>

        <h3>3. Юридическая и Коммерческая модель</h3>
        <p>Для обеспечения соответствия законодательству (включая нормы о ЦФА и налоговый кодекс), проект GBU классифицируется как цифровая программа лояльности.</p>
        <p><strong>Наименование:</strong> Утилитарный цифровой бонус (Utility Token).<br/>
        <strong>Суть:</strong> Цифровое подтверждение права держателя на получение скидки до 20% на готовую продукцию.<br/>
        <strong>Статус:</strong> GBU является цифровой единицей программы лояльности, предоставляющей право на маркетинговые привилегии.</p>

        <div className="table-responsive-wrapper margin-top-20 margin-bottom-20">
          <table className="wp-table">
            <thead>
              <tr>
                <th>Этап взаимодействия</th>
                <th>Коммерческий статус</th>
                <th>Техническая роль</th>
                <th>Выгода держателя</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Приобретение GBU</td>
                <td>Покупка цифрового сертификата на скидку.</td>
                <td>Ликвидность на DEX (C-Chain).</td>
                <td>Фиксация «входной» цены на изделия.</td>
              </tr>
              <tr>
                <td>Хранение (Hold)</td>
                <td>Защита от инфляции (Твердый актив).</td>
                <td>Свободный оборот (X/C-Chain).</td>
                <td>Бонусы растут вместе с рыночной стоимостью гранита.</td>
              </tr>
              <tr>
                <td>Свободный оборот</td>
                <td>Переуступка прав в клубе.</td>
                <td>Торговля между участниками.</td>
                <td>Ликвидность 24/7 (возможность продать токены на бирже).</td>
              </tr>
              <tr>
                <td>Использование</td>
                <td>Активация права на скидку.</td>
                <td>Proof of Burn (Сжигание).</td>
                <td>Получение изделий с выгодой до 20%.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>4. Механика подтверждения: Proof of Burn</h3>
        <p>Для активации скидки используется прозрачный механизм сжигания, который связывает блокчейн-транзакцию с реальным заказом:</p>
        <ul>
          <li><strong>Сжигание:</strong> Клиент отправляет GBU на адрес сжигания через дашборд.</li>
          <li><strong>Верификация:</strong> Система фиксирует эквивалент сожженных бонусов и генерирует уникальный код.</li>
        </ul>
        <p>Пример подтверждения:</p>
        <div className="wp-code-block">
          <p className="wp-code-text">
            ACCOUNT: 0x71C...49FD (Ваш кошелек)<br/>
            STATUS: Burned 12,400 GBU (20% Discount Activated)<br/>
            <strong>DISCOUNT CODE: GBU-X5R2-49FD</strong>
          </p>
        </div>
        <p><strong>Оплата:</strong> Клиент оплачивает фиатную часть заказа (в рублях) за вычетом активированной цифровой скидки.</p>

        <h3>5. Токеномика</h3>
        <p><strong>Максимальная эмиссия:</strong> 969,000,000 GBU.</p>
        <p><strong>Маркетинговая раздача (20%):</strong> Направлена на популяризацию бренда, работу с блогерами и поощрение активных участников сообщества.</p>
        <p><strong>Дефляционная модель:</strong> Каждое использование скидки безвозвратно уменьшает количество токенов в обращении, повышая ценность оставшихся единиц.</p>

        <h3>6. Ключевые преимущества проекта</h3>
        <ul>
          <li><strong>Защита от инфляции:</strong> Гранит — это природный ресурс, который стабильно дорожает. Покупая GBU, человек «замораживает» сегодняшнюю цену на камень для будущих нужд.</li>
          <li><strong>Ликвидность 24/7:</strong> В отличие от физической фуры брусчатки, токены GBU можно реализовать на бирже за несколько минут.</li>
          <li><strong>Эксклюзивность:</strong> Только держатели GBU получают доступ к редким видам камня и приоритетному изготовлению в пиковый сезон (без очереди в 3 месяца).</li>
          <li><strong>Глобальный охват:</strong> Цифровая экосистема позволяет привлекать поддержку со всего мира, создавая ликвидный рынок прав на изделия из гранита.</li>
        </ul>

        <h3>7. Disclaimer (Отказ от ответственности)</h3>
        <p>Токен GBU является исключительно утилитарным инструментом программы лояльности (Utility Token).</p>
        <ul>
          <li>Он не является ценной бумагой, акцией или инвестиционным контрактом.</li>
          <li>Он не предоставляет права собственности на компанию и не подразумевает выплату дивидендов.</li>
          <li>GBU предоставляет исключительно цифровое право на получение маркетинговых привилегий и скидок на готовую продукцию из гранита.</li>
        </ul>
        <p><small>Все операции по обмену токенов на скидки производятся в рамках гражданско-правовых договоров купли-продажи изделий. Пользователь осознает волатильность цифровых активов и самостоятельно несет ответственность за их использование.</small></p>
      </>
    );
  }

  return (
    <>
      <h2 className="text-center">Whitepaper: Granite Bear Utility (GBU)</h2>
      <p><strong>Version:</strong> 1.0 (Official Technical & Business Edition)<br/>
      <strong>Network:</strong> Avalanche (Integration of X, P, C-Chain)<br/>
      <strong>Sector:</strong> RWA (Real World Assets) / Digital Loyalty Programs</p>
      
      <h3>1. Abstract</h3>
      <p>Granite Bear Utility (GBU) is a decentralized ecosystem connecting Web3 technologies with the real production sector (extraction and processing of natural stone). The project is centered on creating a "digital bridge" for consumers of granite products (paving stones, slabs, memorials).</p>
      <p>Given the annual rise in natural resource costs, GBU acts as a utility digital bonus, allowing for price fixation and providing privileges through Avalanche blockchain mechanisms.</p>

      <h3>2. Technological Universality (Avalanche Architecture)</h3>
      <p>The project utilizes Avalanche's three-chain architecture, ensuring fast and low-cost bonus circulation:</p>
      <ul>
        <li><strong>C-Chain (Contract):</strong> Main environment for smart contracts, staking, and Web3 interfaces.</li>
        <li><strong>X-Chain (Exchange):</strong> Environment for instant and ultra-low-cost transfers of discount rights between club members.</li>
        <li><strong>P-Chain (Platform):</strong> Provides security and scalability for major B2B partners.</li>
      </ul>

      <h3>3. Legal and Commercial Model</h3>
      <p>To ensure compliance with legislation (including digital financial asset regulations and tax codes), the GBU project is classified as a digital loyalty program.</p>
      <p><strong>Name:</strong> Utility Digital Bonus (Utility Token).<br/>
      <strong>Essence:</strong> Digital confirmation of the holder's right to receive a discount of up to 20% on finished products.<br/>
      <strong>Status:</strong> GBU is a digital unit of the loyalty program, granting the right to marketing privileges.</p>

      <div className="table-responsive-wrapper margin-top-20 margin-bottom-20">
        <table className="wp-table">
          <thead>
            <tr>
              <th>Interaction Phase</th>
              <th>Commercial Status</th>
              <th>Technical Role</th>
              <th>Holder Benefit</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Acquiring GBU</td>
              <td>Purchase of a digital discount certificate.</td>
              <td>Liquidity on DEX (C-Chain).</td>
              <td>Fixing the "entry" price for products.</td>
            </tr>
            <tr>
              <td>Holding (Hold)</td>
              <td>Protection against inflation (Hard asset).</td>
              <td>Free circulation (X/C-Chain).</td>
              <td>Bonuses grow alongside the market value of granite.</td>
            </tr>
            <tr>
              <td>Free Circulation</td>
              <td>Assignment of rights within the club.</td>
              <td>Trading between participants.</td>
              <td>24/7 liquidity (option to sell tokens on the exchange).</td>
            </tr>
            <tr>
              <td>Usage</td>
              <td>Activation of the right to a discount.</td>
              <td>Proof of Burn (Burning).</td>
              <td>Receiving products with a benefit of up to 20%.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>4. Verification Mechanics: Proof of Burn</h3>
      <p>To activate the discount, a transparent burning mechanism is used, linking the blockchain transaction to a specific order:</p>
      <ul>
        <li><strong>Burning:</strong> The client sends GBU to the burn address via the dashboard.</li>
        <li><strong>Verification:</strong> The system records the equivalent of the burned bonuses and generates a unique code.</li>
      </ul>
      <p>Verification Example:</p>
      <div className="wp-code-block">
        <p className="wp-code-text">
          ACCOUNT: 0x71C...49FD (Your wallet)<br/>
          STATUS: Burned 12,400 GBU (20% Discount Activated)<br/>
          <strong>DISCOUNT CODE: GBU-X5R2-49FD</strong>
        </p>
      </div>
      <p><strong>Payment:</strong> The client pays the fiat part of the order in local currency, minus the activated digital discount.</p>

      <h3>5. Tokenomics</h3>
      <p><strong>Maximum Emission:</strong> 969,000,000 GBU.</p>
      <p><strong>Marketing Distribution (20%):</strong> Aimed at brand popularization, working with influencers, and rewarding active community members.</p>
      <p><strong>Deflationary Model:</strong> Each discount use permanently reduces the number of tokens in circulation, increasing the value of the remaining units.</p>

      <h3>6. Key Project Advantages</h3>
      <ul>
        <li><strong>Inflation Protection:</strong> Granite is a natural resource that steadily increases in price. By purchasing GBU, one "freezes" today’s stone price for future needs.</li>
        <li><strong>24/7 Liquidity:</strong> Unlike a physical truckload of paving stones, GBU tokens can be sold on an exchange in minutes.</li>
        <li><strong>Exclusivity:</strong> Only GBU holders gain access to rare stone types and priority manufacturing during peak season (no 3-month queue).</li>
        <li><strong>Global Reach:</strong> The digital ecosystem allows for worldwide support, creating a liquid market for granite product rights.</li>
      </ul>
      
      <h3>7. Disclaimer</h3>
      <p>The GBU token is strictly a utility instrument of the loyalty program (Utility Token).</p>
      <ul>
        <li>It is not a security, share, or investment contract.</li>
        <li>It does not provide ownership in the company and does not imply dividend payments.</li>
        <li>GBU provides exclusively the digital right to receive marketing privileges and discounts on finished granite products.</li>
      </ul>
      <p><small>All operations for exchanging tokens for discounts are carried out within the framework of civil law contracts for the purchase and sale of products. The user acknowledges the volatility of digital assets and assumes personal responsibility for their use.</small></p>
    </>
  );
};

export default WhitepaperContent;
