import React, { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';

const TokenomicsChart = lazy(() => import('./TokenomicsChart'));

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

interface TokenomicsItem {
  name: string;
  percent: string;
  amount: string;
}

interface TokenomicsSectionProps {
  t: {
    tokenomics: {
      title: string;
      subtitle: string;
      tableTitle: string[];
      items: TokenomicsItem[];
    };
  };
  tokenomicsData: { name: string; value: number; color: string }[];
}

const TokenomicsSection: React.FC<TokenomicsSectionProps> = ({ t, tokenomicsData }) => {
  return (
    <section id="tokenomics" className="section container">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
        <div className="text-center">
          <h2><span className="tokenomics-text-gradient">{t.tokenomics.title}</span></h2>
          <p className="text-muted-color">{t.tokenomics.subtitle}</p>
        </div>

        <div className="tokenomics-main-container">
          <div className="tokenomics-chart-box">
            <Suspense fallback={<div className="text-center margin-top-40">Loading Chart...</div>}>
              <TokenomicsChart data={tokenomicsData} />
            </Suspense>
          </div>

          <div className="table-wrapper">
            <div className="table-responsive-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>{t.tokenomics.tableTitle[0]}</th>
                    <th>{t.tokenomics.tableTitle[1]}</th>
                    <th>{t.tokenomics.tableTitle[2]}</th>
                  </tr>
                </thead>
                <tbody>
                  {t.tokenomics.items.map((item: TokenomicsItem, i: number) => (
                    <tr key={i}>
                      <td>{item.name}</td>
                      <td>{item.percent}</td>
                      <td>{item.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default TokenomicsSection;
