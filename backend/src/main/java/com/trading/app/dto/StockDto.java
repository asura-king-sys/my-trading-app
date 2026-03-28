package com.trading.app.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StockDto {
    private String symbol;
    private String companyName;
    private Double price;
    private Double change;
    private Double changePercent;
    private Long volume;
    private String sector;
}
