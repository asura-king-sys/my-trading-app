package com.trading.app.services;

import com.trading.app.dto.StockDto;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class StockService {

    private final Map<String, StockDto> stocks = new ConcurrentHashMap<>();
    private final Random random = new Random();

    @PostConstruct
    public void init() {
        List<StockDto> initialStocks = Arrays.asList(
                new StockDto("AAPL", "Apple Inc.", 150.0, 0.0, 0.0, 1000000L, "Technology"),
                new StockDto("GOOGL", "Alphabet Inc.", 2800.0, 0.0, 0.0, 500000L, "Technology"),
                new StockDto("MSFT", "Microsoft Corp.", 300.0, 0.0, 0.0, 800000L, "Technology"),
                new StockDto("AMZN", "Amazon.com Inc.", 3300.0, 0.0, 0.0, 400000L, "Consumer Cyclical"),
                new StockDto("TSLA", "Tesla Inc.", 700.0, 0.0, 0.0, 600000L, "Consumer Cyclical"),
                new StockDto("META", "Meta Platforms Inc.", 330.0, 0.0, 0.0, 700000L, "Communication Services"),
                new StockDto("NVDA", "NVIDIA Corp.", 220.0, 0.0, 0.0, 900000L, "Technology"),
                new StockDto("NFLX", "Netflix Inc.", 590.0, 0.0, 0.0, 300000L, "Communication Services"),
                new StockDto("AMD", "Advanced Micro Devices Inc.", 110.0, 0.0, 0.0, 1200000L, "Technology"),
                new StockDto("INTC", "Intel Corp.", 50.0, 0.0, 0.0, 1500000L, "Technology"),
                new StockDto("JPM", "JPMorgan Chase & Co.", 160.0, 0.0, 0.0, 1000000L, "Financial Services"),
                new StockDto("BAC", "Bank of America Corp.", 40.0, 0.0, 0.0, 2000000L, "Financial Services"),
                new StockDto("DIS", "The Walt Disney Co.", 170.0, 0.0, 0.0, 600000L, "Communication Services"),
                new StockDto("UBER", "Uber Technologies Inc.", 45.0, 0.0, 0.0, 800000L, "Technology"),
                new StockDto("SPOT", "Spotify Technology S.A.", 250.0, 0.0, 0.0, 200000L, "Communication Services")
        );

        for (StockDto stock : initialStocks) {
            stocks.put(stock.getSymbol(), stock);
        }
    }

    public List<StockDto> getAllStocks() {
        List<StockDto> simulatedStocks = new ArrayList<>();
        for (StockDto stock : stocks.values()) {
            simulatedStocks.add(simulatePrice(stock));
        }
        return simulatedStocks;
    }

    public StockDto getStockBySymbol(String symbol) {
        StockDto stock = stocks.get(symbol.toUpperCase());
        if (stock == null) {
            throw new RuntimeException("Stock not found with symbol: " + symbol);
        }
        return simulatePrice(stock);
    }

    private StockDto simulatePrice(StockDto stock) {
        double changePercent = (random.nextDouble() * 0.06) - 0.03; // -3% to +3%
        double oldPrice = stock.getPrice();
        double newPrice = oldPrice * (1 + changePercent);
        double change = newPrice - oldPrice;

        return StockDto.builder()
                .symbol(stock.getSymbol())
                .companyName(stock.getCompanyName())
                .price(Math.round(newPrice * 100.0) / 100.0)
                .change(Math.round(change * 100.0) / 100.0)
                .changePercent(Math.round(changePercent * 10000.0) / 100.0)
                .volume(stock.getVolume() + random.nextInt(10000) - 5000)
                .sector(stock.getSector())
                .build();
    }
}
