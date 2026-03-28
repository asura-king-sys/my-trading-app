package com.trading.app.controllers;

import com.trading.app.dto.TradeRequest;
import com.trading.app.models.Portfolio;
import com.trading.app.models.Transaction;
import com.trading.app.services.TradeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class TradeController {

    @Autowired
    private TradeService tradeService;

    @PostMapping("/trade")
    public ResponseEntity<?> handleTrade(Authentication authentication, @Valid @RequestBody TradeRequest request) {
        String username = authentication.getName();
        if (request.getType() == Transaction.TransactionType.BUY) {
            tradeService.buyStock(username, request);
        } else {
            tradeService.sellStock(username, request);
        }
        return ResponseEntity.ok().build();
    }

    @GetMapping("/portfolio")
    public ResponseEntity<List<Portfolio>> getPortfolio(Authentication authentication) {
        return ResponseEntity.ok(tradeService.getPortfolio(authentication.getName()));
    }

    @GetMapping("/history")
    public ResponseEntity<List<Transaction>> getHistory(Authentication authentication) {
        return ResponseEntity.ok(tradeService.getHistory(authentication.getName()));
    }

    @GetMapping("/user/balance")
    public ResponseEntity<Double> getBalance(Authentication authentication) {
        return ResponseEntity.ok(tradeService.getBalance(authentication.getName()));
    }
}
