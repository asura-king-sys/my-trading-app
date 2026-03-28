import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../services/api';
import Layout from '../components/Layout';
import './DashboardPage.css';

const mockEquityData = [
  { name: 'Mon', value: 10000 },
  { name: 'Tue', value: 10500 },
  { name: 'Wed', value: 10200 },
  { name: 'Thu', value: 10800 },
  { name: 'Fri', value: 11200 },
  { name: 'Sat', value: 11100 },
  { name: 'Sun', value: 11500 },
];

const DashboardPage = () => {
  const [balance, setBalance] = useState(0);
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [topMovers, setTopMovers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [balanceRes, portfolioRes, stocksRes] = await Promise.all([
          api.get('/user/balance'),
          api.get('/portfolio'),
          api.get('/stocks')
        ]);

        setBalance(balanceRes.data);
        
        // Calculate total portfolio value
        const total = portfolioRes.data.reduce((acc, item) => {
          const currentStock = stocksRes.data.find(s => s.symbol === item.symbol);
          return acc + (currentStock?.price || item.averageCost) * item.quantity;
        }, 0);
        setPortfolioValue(total);

        // Sort stocks by changePercent for movers
        const sortedStocks = [...stocksRes.data].sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent));
        setTopMovers(sortedStocks.slice(0, 5));
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Layout>
      <div className="dashboard-container">
        <h1>Dashboard</h1>
        
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Net Worth</h3>
            <p className="stat-value">${(balance + portfolioValue).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="stat-card">
            <h3>Portfolio Value</h3>
            <p className="stat-value">${portfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="stat-card">
            <h3>Cash Balance</h3>
            <p className="stat-value">${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
        </div>

        <div className="dashboard-charts">
          <div className="chart-card">
            <h3>Equity Growth (7D)</h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockEquityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#4ecca3" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="movers-card">
            <h3>Top Market Movers</h3>
            <div className="movers-list">
              {topMovers.map(stock => (
                <div key={stock.symbol} className="mover-item">
                  <span className="mover-symbol">{stock.symbol}</span>
                  <span className="mover-price">${stock.price.toFixed(2)}</span>
                  <span className={`mover-change ${stock.change >= 0 ? 'positive' : 'negative'}`}>
                    {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
