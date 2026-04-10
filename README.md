# 📈 Trading App — Stock Market Simulation Platform

## Introduction

**Trading App** is a full-stack web application that simulates a real-time stock trading environment. Built as a college project, it allows users to register, log in, browse live (simulated) stock market data, buy and sell stocks, track their portfolio performance, and view their complete transaction history — all through a clean, responsive interface.

The backend is powered by **Spring Boot (Java)** with JWT-based authentication and an in-memory H2 database, while the frontend is built using **React.js** with Recharts for data visualization.

---

## 👥 Team Members

| Name | Registration Number |
|------|-------------------|
| Hardik Bajpai | 24BCE10397 |
| Daksh Lathiya | 24BCE10371 |
| Diya Patel | 24BCE10007 |
| Shreya Ramesh | 24BCE10042 |
| Avishi Sharma | 24BCE10297 |

---

## 🚀 Features

- **User Authentication** — Secure register/login with JWT tokens
- **Live Market Data** — Simulated real-time stock prices with random fluctuations (±3%)
- **Stock Trading** — Buy and sell stocks with instant portfolio updates
- **Portfolio Tracking** — View holdings, average cost, current value, and P&L
- **Transaction History** — Complete log of all buy/sell activity
- **Dashboard** — Net worth overview, equity chart, and top market movers
- **Sector Filtering** — Filter stocks by sector on the Market page
- **Auto-Refresh** — Stock prices refresh automatically every 15 seconds
- **Responsive Design** — Works across desktop and tablet screens

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|-----------|---------|
| Java 17 | Core language |
| Spring Boot 3.2 | REST API framework |
| Spring Security | Authentication & authorization |
| JSON Web Tokens (JWT) | Stateless session management |
| Spring Data JPA / Hibernate | ORM and database interaction |
| H2 Database | In-memory relational database |
| Lombok | Boilerplate code reduction |
| Maven | Build and dependency management |

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 18 | UI framework |
| React Router v6 | Client-side routing |
| Axios | HTTP requests to the backend |
| Recharts | Charts (line, pie) |
| CSS Modules | Component-level styling |

---

## 📁 Project Structure

```
my-trading-app/
├── backend/
│   ├── src/main/java/com/trading/app/
│   │   ├── controllers/        # REST API controllers (Auth, Stock, Trade)
│   │   ├── dto/                # Data Transfer Objects
│   │   ├── models/             # JPA entities (User, Portfolio, Transaction)
│   │   ├── repositories/       # Spring Data JPA repositories
│   │   ├── security/           # JWT filter, SecurityConfig, UserDetailsService
│   │   └── services/           # Business logic (AuthService, StockService, TradeService)
│   └── src/main/resources/
│       └── application.properties
│
└── frontend/
    └── src/
        ├── components/         # Reusable components (Layout, TradeModal)
        ├── context/            # AuthContext for global auth state
        ├── pages/              # Page components (Dashboard, Market, Portfolio, History)
        ├── services/           # Axios API instance with interceptors
        └── styles/             # Global CSS
```

---

## ⚙️ Setup & Installation

### Prerequisites
- **Java 17+** installed
- **Node.js 16+** and **npm** installed
- Git

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd my-trading-app
```

### 2. Run the Backend
```bash
cd backend
./mvnw spring-boot:run
```
The backend will start on **http://localhost:8080**

> The H2 console is available at **http://localhost:8080/h2-console**
> - JDBC URL: `jdbc:h2:mem:tradingdb`
> - Username: `sa`
> - Password: `password`

### 3. Run the Frontend
```bash
cd frontend
npm install
npm start
```
The frontend will start on **http://localhost:3000** and proxy API requests to the backend automatically.

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT token |

### Stocks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stocks` | Get all stocks with simulated prices |
| GET | `/api/stocks/{symbol}` | Get a specific stock by symbol |

### Trading & Portfolio *(Requires JWT)*
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/trade` | Execute a buy or sell trade |
| GET | `/api/portfolio` | Get current user's holdings |
| GET | `/api/history` | Get full transaction history |
| GET | `/api/user/balance` | Get current cash balance |

---

## 💡 How It Works

1. **Register** with a username, email, and password — you start with **$10,000** virtual cash.
2. **Browse the Market** to see 15 stocks with live-simulated prices updating every 15 seconds.
3. **Trade** by clicking the Trade button on any stock, selecting BUY or SELL, and entering a quantity.
4. **Monitor your Portfolio** to see your holdings, average cost basis, current market value, and unrealized P&L.
5. **Review History** for a complete audit trail of every transaction.

---

## 🔮 Future Improvements

- Real stock market data integration (e.g., Alpha Vantage or Yahoo Finance API).
- WebSocket support for true real-time price streaming.
- Stop-loss and limit order functionality.
- Persistent database (PostgreSQL / MySQL) for production use.
- User profile management and avatar support.
- Leaderboard to compare performance across users.
- Mobile-responsive redesign and PWA support.

---

## 📝 License

This project was developed for academic purposes as part of a college assignment. All stock data is simulated and does not reflect real market values.

// added by shreya