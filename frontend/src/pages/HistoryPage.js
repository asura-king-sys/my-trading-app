import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Layout from '../components/Layout';
import './HistoryPage.css';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get('/history');
        setHistory(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch history', error);
      }
    };
    fetchHistory();
  }, []);

  const totalTrades = history.length;
  const totalBought = history.filter(h => h.type === 'BUY').reduce((acc, h) => acc + h.total, 0);
  const totalSold = history.filter(h => h.type === 'SELL').reduce((acc, h) => acc + h.total, 0);

  return (
    <Layout>
      <div className="history-container">
        <h1>Transaction History</h1>

        <div className="history-stats">
          <div className="stat-card">
            <h3>Total Trades</h3>
            <p>{totalTrades}</p>
          </div>
          <div className="stat-card">
            <h3>Total Volume (Buy)</h3>
            <p>${totalBought.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="stat-card">
            <h3>Total Volume (Sell)</h3>
            <p>${totalSold.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
        </div>

        <div className="history-table-container">
          <table className="history-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Stock</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {history.map(tx => (
                <tr key={tx.id}>
                  <td>{new Date(tx.createdAt).toLocaleDateString()} {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                  <td><strong>{tx.symbol}</strong></td>
                  <td>
                    <span className={`badge ${tx.type.toLowerCase()}`}>
                      {tx.type}
                    </span>
                  </td>
                  <td>{tx.quantity}</td>
                  <td>${tx.price.toFixed(2)}</td>
                  <td>${tx.total.toFixed(2)}</td>
                </tr>
              ))}
              {history.length === 0 && !loading && (
                <tr>
                  <td colSpan="6" className="empty-row">No transactions found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default HistoryPage;
