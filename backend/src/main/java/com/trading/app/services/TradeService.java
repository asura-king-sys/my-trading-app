package com.trading.app.services;

import com.trading.app.dto.StockDto;
import com.trading.app.dto.TradeRequest;
import com.trading.app.models.Portfolio;
import com.trading.app.models.Transaction;
import com.trading.app.models.User;
import com.trading.app.repositories.PortfolioRepository;
import com.trading.app.repositories.TransactionRepository;
import com.trading.app.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class TradeService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PortfolioRepository portfolioRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private StockService stockService;

    @Transactional
    public void buyStock(String username, TradeRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        StockDto stock = stockService.getStockBySymbol(request.getSymbol());
        double totalCost = stock.getPrice() * request.getQuantity();

        if (user.getBalance() < totalCost) {
            throw new RuntimeException("Insufficient balance");
        }

        // Deduct balance
        user.setBalance(user.getBalance() - totalCost);
        userRepository.save(user);

        // Update Portfolio
        Optional<Portfolio> existingPortfolio = portfolioRepository.findByUserAndSymbol(user, request.getSymbol());
        if (existingPortfolio.isPresent()) {
            Portfolio p = existingPortfolio.get();
            double newAvgCost = ((p.getAverageCost() * p.getQuantity()) + totalCost) / (p.getQuantity() + request.getQuantity());
            p.setQuantity(p.getQuantity() + request.getQuantity());
            p.setAverageCost(newAvgCost);
            portfolioRepository.save(p);
        } else {
            Portfolio p = Portfolio.builder()
                    .user(user)
                    .symbol(request.getSymbol())
                    .companyName(stock.getCompanyName())
                    .quantity(request.getQuantity())
                    .averageCost(stock.getPrice())
                    .build();
            portfolioRepository.save(p);
        }

        // Save Transaction
        Transaction t = Transaction.builder()
                .user(user)
                .symbol(request.getSymbol())
                .companyName(stock.getCompanyName())
                .type(Transaction.TransactionType.BUY)
                .quantity(request.getQuantity())
                .price(stock.getPrice())
                .total(totalCost)
                .build();
        transactionRepository.save(t);
    }

    @Transactional
    public void sellStock(String username, TradeRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Portfolio p = portfolioRepository.findByUserAndSymbol(user, request.getSymbol())
                .orElseThrow(() -> new RuntimeException("Stock not found in portfolio"));

        if (p.getQuantity() < request.getQuantity()) {
            throw new RuntimeException("Insufficient quantity in portfolio");
        }

        StockDto stock = stockService.getStockBySymbol(request.getSymbol());
        double totalGain = stock.getPrice() * request.getQuantity();

        // Add to balance
        user.setBalance(user.getBalance() + totalGain);
        userRepository.save(user);

        // Update Portfolio
        if (p.getQuantity().equals(request.getQuantity())) {
            portfolioRepository.delete(p);
        } else {
            p.setQuantity(p.getQuantity() - request.getQuantity());
            portfolioRepository.save(p);
        }

        // Save Transaction
        Transaction t = Transaction.builder()
                .user(user)
                .symbol(request.getSymbol())
                .companyName(stock.getCompanyName())
                .type(Transaction.TransactionType.SELL)
                .quantity(request.getQuantity())
                .price(stock.getPrice())
                .total(totalGain)
                .build();
        transactionRepository.save(t);
    }

    public List<Portfolio> getPortfolio(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return portfolioRepository.findByUser(user);
    }

    public List<Transaction> getHistory(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return transactionRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public Double getBalance(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getBalance();
    }
}
