package com.trading.app.dto;

import com.trading.app.models.Transaction;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TradeRequest {
    @NotBlank
    private String symbol;

    @NotNull
    @Min(1)
    private Integer quantity;

    @NotNull
    private Transaction.TransactionType type;
}
