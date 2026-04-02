import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Layout from '../components/Layout';
import TradeModal from '../components/TradeModal';
import './MarketPage.css';

const MarketPage = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStock, setSelectedStock] = useState(null);
  const [filter, setFilter] = useState('All');

  const fetchStocks = async () => {
    try {
      const response = await api.get('/stocks');
      setStocks(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch stocks', error);
    }
  };

  useEffect(() => {
    fetchStocks();
    const interval = setInterval(fetchStocks, 15000);
    return () => clearInterval(interval);
  }, []);

  const sectors = ['All', ...new Set(stocks.map(s => s.sector))];
  const filteredStocks = filter === 'All' ? stocks : stocks.filter(s => s.sector === filter);

  return (
    <Layout>
      <div className="market-container">
        <header className="page-header">
          <h1>Stock Market</h1>
          <div className="filter-group">
            <label>Sector:</label>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              {sectors.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </header>

        {loading ? (
          <p>Loading market data...</p>
        ) : (
          <div className="table-responsive">
            <table className="market-table">
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Company</th>
                  <th>Price</th>
                  <th>Change (%)</th>
                  <th>Sector</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredStocks.map(stock => (
                  <tr key={stock.symbol}>
                    <td className="bold">{stock.symbol}</td>
                    <td>{stock.companyName}</td>
                    <td>${stock.price.toFixed(2)}</td>
                    <td className={stock.change >= 0 ? 'positive' : 'negative'}>
                      {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                    </td>
                    <td>{stock.sector}</td>
                    <td>
                      <button className="trade-btn" onClick={() => setSelectedStock(stock)}>Trade</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedStock && (
          <TradeModal 
            stock={selectedStock} 
            onClose={() => setSelectedStock(null)} 
            onTradeSuccess={fetchStocks}
          />
        )}
      </div>
    </Layout>
  );
};

export default MarketPage;
