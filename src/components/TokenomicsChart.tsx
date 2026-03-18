import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

interface TokenomicsChartProps {
  data: { name: string; value: number; color: string }[];
}

const TokenomicsChart: React.FC<TokenomicsChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={80} outerRadius={120} paddingAngle={2} dataKey="value">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <RechartsTooltip contentStyle={{ background: '#1A1A1A', border: '1px solid #333' }} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default TokenomicsChart;
