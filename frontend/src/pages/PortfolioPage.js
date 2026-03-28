import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import api from '../services/api';
import Layout from '../components/Layout';
import './PortfolioPage.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const PortfolioPage = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [portfolioRes, stocksRes] = await Promise.all([
          api.get('/portfolio'),
          api.get('/stocks')
        ]);
        setPortfolio(portfolioRes.data);
        setStocks(stocksRes.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch portfolio data', error);
      }
    };
    fetchData();
  }, []);

  const enrichedPortfolio = portfolio.map(item => {
    const currentStock = stocks.find(s => s.symbol === item.symbol);
    const currentValue = (currentStock?.price || item.averageCost) * item.quantity;
    const totalCost = item.averageCost * item.quantity;
    const pnl = currentValue - totalCost;
    const pnlPercent = (pnl / totalCost) * 100;
    
    return { ...item, currentPrice: currentStock?.price, currentValue, pnl, pnlPercent };
  });

  const totalInvested = enrichedPortfolio.reduce((acc, item) => acc + (item.averageCost * item.quantity), 0);
  const totalValue = enrichedPortfolio.reduce((acc, item) => acc + item.currentValue, 0);
  const totalPnL = totalValue - totalInvested;

  const chartData = enrichedPortfolio.map(item => ({
    name: item.symbol,
    value: item.currentValue
  }));

  return (
    <Layout>
      <div className="portfolio-container">
        <h1>My Portfolio</h1>
        
        <div className="portfolio-stats">
          <div className="stat-item">
            <label>Total Invested</label>
            <p>${totalInvested.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="stat-item">
            <label>Total Value</label>
            <p>${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
          <div className={`stat-item ${totalPnL >= 0 ? 'positive' : 'negative'}`}>
            <label>Total P&L</label>
            <p>{totalPnL >= 0 ? '+' : ''}${totalPnL.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
        </div>

        <div className="portfolio-content">
          <div className="holdings-list">
            <h3>Holdings</h3>
            <table className="holdings-table">
              <thead>
                <tr>
                  <th>Stock</th>
                  <th>Qty</th>
                  <th>Avg Cost</th>
                  <th>Current</th>
                  <th>P&L</th>
                </tr>
              </thead>
              <tbody>
                {enrichedPortfolio.map(item => (
                  <tr key={item.symbol}>
                    <td><strong>{item.symbol}</strong></td>
                    <td>{item.quantity}</td>
                    <td>${item.averageCost.toFixed(2)}</td>
                    <td>${item.currentPrice?.toFixed(2)}</td>
                    <td className={item.pnl >= 0 ? 'positive' : 'negative'}>
                      {item.pnl >= 0 ? '+' : ''}{item.pnl.toFixed(2)} ({item.pnlPercent.toFixed(2)}%)
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="allocation-chart">
            <h3>Allocation</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PortfolioPage;
