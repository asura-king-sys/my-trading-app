import React, { useState } from 'react';
import api from '../services/api';
import './TradeModal.css';

const TradeModal = ({ stock, onClose, onTradeSuccess }) => {
  const [quantity, setQuantity] = useState(1);
  const [type, setType] = useState('BUY');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const totalCost = (stock.price * quantity).toFixed(2);

  const handleTrade = async () => {
    setLoading(true);
    setError('');
    try {
      await api.post('/trade', {
        symbol: stock.symbol,
        quantity: parseInt(quantity),
        type: type
      });
      onTradeSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Trade failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <header className="modal-header">
          <h3>Trade {stock.symbol}</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </header>
        <div className="modal-body">
          <div className="stock-info">
            <p><strong>Stock:</strong> {stock.companyName}</p>
            <p><strong>Price:</strong> ${stock.price.toFixed(2)}</p>
          </div>
          
          <div className="trade-actions">
            <div className="type-selector">
              <button 
                className={type === 'BUY' ? 'active buy' : ''} 
                onClick={() => setType('BUY')}
              >BUY</button>
              <button 
                className={type === 'SELL' ? 'active sell' : ''} 
                onClick={() => setType('SELL')}
              >SELL</button>
            </div>
            
            <div className="input-group">
              <label>Quantity</label>
              <input 
                type="number" 
                min="1" 
                value={quantity} 
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            
            <div className="total-cost">
              <p>Estimated Total: <strong>${totalCost}</strong></p>
            </div>
          </div>
          
          {error && <p className="error-msg">{error}</p>}
        </div>
        <footer className="modal-footer">
          <button 
            className={`confirm-btn ${type.toLowerCase()}`} 
            onClick={handleTrade}
            disabled={loading}
          >
            {loading ? 'Processing...' : `Confirm ${type}`}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default TradeModal;
