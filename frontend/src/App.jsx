// import { useEffect, useState } from "react";
// import axios from "axios";

// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer
// } from "recharts";

// import "./App.css";

// const API = "";
// const symbol = "DELL";

// // ==========================================
// // DATE FORMATTER
// // ==========================================

// const formatChartDate = (date) => {
//   const d = new Date(date);

//   return d.toLocaleDateString("en-GB", {
//     day: "2-digit",
//     month: "short"
//   });
// };

// function App() {
//   const [strategy, setStrategy] = useState(null);
//   const [portfolio, setPortfolio] = useState(null);
//   const [trades, setTrades] = useState([]);
//   const [history, setHistory] = useState([]);

//   const [quantity, setQuantity] = useState(1);
//   const [message, setMessage] = useState("");
//   const [lastUpdated, setLastUpdated] = useState(null);

//   // ==========================================
//   // LOAD DATA
//   // ==========================================

//   const loadData = async () => {
//     try {
//       const [
//         strategyRes,
//         portfolioRes,
//         tradesRes,
//         historyRes
//       ] = await Promise.all([
//         axios.get(`${API}/api/strategy/${symbol}`),
//         axios.get(`${API}/api/portfolio`),
//         axios.get(`${API}/api/trades`),
//         axios.get(`${API}/api/stock/${symbol}/history`)
//       ]);

//       setStrategy(strategyRes.data);
//       setPortfolio(portfolioRes.data);
//       setTrades(tradesRes.data.trades);

//       // ==========================================
//       // PRICE CHART DATA
//       // ==========================================

//       const chartData = historyRes.data.values
//         .slice()
//         .reverse()
//         .map((item) => ({
//           date: item.datetime,
//           price: Number(item.close)
//         }));

//       setHistory(chartData);
//       setLastUpdated(new Date());

//     } catch (error) {
//       console.error("Failed to load data:", error);
//     }
//   };

//   // ==========================================
//   // BUY / SELL
//   // ==========================================

//   const handleTrade = async (type) => {
//     try {
//       setMessage("");

//       if (!strategy) {
//         setMessage("Strategy data is not available");
//         return;
//       }

//       const price = Number(strategy.currentPrice);
//       const tradeQuantity = Number(quantity);

//       if (!tradeQuantity || tradeQuantity <= 0) {
//         setMessage("Quantity must be greater than 0");
//         return;
//       }

//       const response = await axios.post(
//         `${API}/api/trade/${type}`,
//         {
//           symbol,
//           quantity: tradeQuantity,
//           price
//         }
//       );

//       setMessage(response.data.message);

//       await loadData();

//     } catch (error) {
//       setMessage(
//         error.response?.data?.message || "Trade failed"
//       );
//     }
//   };

//   // ==========================================
//   // INITIAL LOAD + AUTO REFRESH
//   // ==========================================

//   useEffect(() => {
//     loadData();

//     const interval = setInterval(() => {
//       loadData();
//     }, 30000);

//     return () => clearInterval(interval);
//   }, []);

//   // ==========================================
//   // LOADING
//   // ==========================================

//   if (!strategy || !portfolio) {
//     return <h2 className="loading">Loading Trading Bot...</h2>;
//   }

//   // ==========================================
//   // UI
//   // ==========================================

//   return (
//     <div className="app">

//       <h1>📈 Trading Bot Dashboard</h1>

//       {/* ======================================
//           LAST UPDATED
//       ====================================== */}

//       {lastUpdated && (
//         <p className="last-updated">
//           Last Updated: {lastUpdated.toLocaleTimeString()}
//         </p>
//       )}

//       {/* ======================================
//           SUMMARY CARDS
//       ====================================== */}

//       <div className="cards">

//         <div className="card">
//           <h3>Virtual Balance</h3>
//           <p>
//             ${Number(portfolio.balance).toFixed(2)}
//           </p>
//         </div>

//         <div className="card">
//           <h3>Portfolio Value</h3>
//           <p>
//             ${Number(portfolio.totalPortfolioValue).toFixed(2)}
//           </p>
//         </div>

//         <div className="card">
//           <h3>Total P/L</h3>
//           <p>
//             ${Number(portfolio.totalProfitLoss).toFixed(2)}
//           </p>
//         </div>

//       </div>

//       {/* ======================================
//           STRATEGY
//       ====================================== */}

//       <div className="section">

//         <h2>{symbol} Strategy</h2>

//         <div className="strategy">

//           <div>
//             <strong>Current Price</strong>
//             <p>
//               ${Number(strategy.currentPrice).toFixed(2)}
//             </p>
//           </div>

//           <div>
//             <strong>EMA 9</strong>
//             <p>
//               {Number(strategy.ema9).toFixed(2)}
//             </p>
//           </div>

//           <div>
//             <strong>EMA 21</strong>
//             <p>
//               {Number(strategy.ema21).toFixed(2)}
//             </p>
//           </div>

//           <div>
//             <strong>RSI</strong>
//             <p>
//               {Number(strategy.rsi).toFixed(2)}
//             </p>
//           </div>

//           <div>
//             <strong>Signal</strong>

//             <p
//               className={`signal ${strategy.signal.toLowerCase()}`}
//             >
//               {strategy.signal}
//             </p>
//           </div>

//         </div>

//         {/* ====================================
//             BUY / SELL CONTROLS
//         ==================================== */}

//         <div className="trade-controls">

//           <input
//             type="number"
//             min="1"
//             value={quantity}
//             onChange={(e) => setQuantity(e.target.value)}
//           />

//           <button
//             className="buy-button"
//             onClick={() => handleTrade("buy")}
//           >
//             BUY
//           </button>

//           <button
//             className="sell-button"
//             onClick={() => handleTrade("sell")}
//           >
//             SELL
//           </button>

//         </div>

//         {/* ====================================
//             TRADE ALERT
//         ==================================== */}

//         {message && (
//           <div className="trade-alert">
//             ✓ {message}
//           </div>
//         )}

//       </div>

//       {/* ======================================
//           PRICE CHART
//       ====================================== */}

//       <div className="section">

//         <h2>{symbol} Price Chart</h2>

//         <div className="chart-container">

//           <ResponsiveContainer width="100%" height="100%">

//             <LineChart
//               data={history}
//               margin={{
//                 top: 10,
//                 right: 15,
//                 left: 5,
//                 bottom: 5
//               }}
//             >

//               <CartesianGrid strokeDasharray="3 3" />

//               <XAxis
//                 dataKey="date"
//                 tickFormatter={formatChartDate}
//                 tick={{ fontSize: 13 }}
//                 minTickGap={35}
//               />

//               <YAxis
//                 domain={["auto", "auto"]}
//                 tick={{ fontSize: 13 }}
//               />

//               <Tooltip
//                 labelFormatter={(value) =>
//                   new Date(value).toLocaleDateString(
//                     "en-GB",
//                     {
//                       day: "2-digit",
//                       month: "short",
//                       year: "numeric"
//                     }
//                   )
//                 }
//                 formatter={(value) => [
//                   `$${Number(value).toFixed(2)}`,
//                   "Price"
//                 ]}
//               />

//               <Line
//                 type="monotone"
//                 dataKey="price"
//                 stroke="#2563eb"
//                 dot={false}
//                 strokeWidth={2}
//               />

//             </LineChart>

//           </ResponsiveContainer>

//         </div>

//       </div>

//       {/* ======================================
//           HOLDINGS
//       ====================================== */}

//       <div className="section">

//         <h2>Holdings</h2>

//         {portfolio.holdings.length === 0 ? (

//           <p>No holdings</p>

//         ) : (

//           <div className="holdings">

//             {portfolio.holdings.map((holding) => (

//               <div
//                 className="holding"
//                 key={holding.symbol}
//               >

//                 <div className="holding-symbol">
//                   {holding.symbol}
//                 </div>

//                 <div className="holding-info">

//                   <div>
//                     <span>Quantity</span>
//                     <strong>
//                       {holding.quantity}
//                     </strong>
//                   </div>

//                   <div>
//                     <span>Avg Price</span>
//                     <strong>
//                       ${Number(holding.averagePrice).toFixed(2)}
//                     </strong>
//                   </div>

//                   <div>
//                     <span>Current Price</span>
//                     <strong>
//                       $
//                       {holding.symbol === symbol
//                         ? Number(strategy.currentPrice).toFixed(2)
//                         : Number(holding.currentPrice).toFixed(2)}
//                     </strong>
//                   </div>

//                   <div>
//                     <span>P/L</span>

//                     <strong
//                       className={
//                         Number(holding.profitLoss) >= 0
//                           ? "profit"
//                           : "loss"
//                       }
//                     >
//                       ${Number(holding.profitLoss).toFixed(2)}
//                     </strong>
//                   </div>

//                 </div>

//               </div>

//             ))}

//           </div>

//         )}

//       </div>

//       {/* ======================================
//           TRADE HISTORY
//       ====================================== */}

//       <div className="section">

//         <h2>Trade History</h2>

//         {trades.length === 0 ? (

//           <p>No trades yet</p>

//         ) : (

//           <div className="trade-history">

//             {trades.map((trade) => (

//               <div
//                 className="trade"
//                 key={trade._id}
//               >

//                 <strong
//                   className={
//                     trade.type === "BUY"
//                       ? "buy"
//                       : "sell"
//                   }
//                 >
//                   {trade.type}
//                 </strong>

//                 <span>
//                   {trade.symbol}
//                 </span>

//                 <span>
//                   {trade.quantity} × $
//                   {Number(trade.price).toFixed(2)}
//                 </span>

//                 <span>
//                   P/L: $
//                   {Number(trade.profitLoss).toFixed(2)}
//                 </span>

//               </div>

//             ))}

//           </div>

//         )}

//       </div>

//       {/* ======================================
//           REFRESH
//       ====================================== */}

//       <button
//         className="refresh-button"
//         onClick={loadData}
//       >
//         🔄 Refresh Data
//       </button>

//     </div>
//   );
// }

// export default App;



import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./App.css";

const API = "";
const symbol = "DELL";

const money = (v) => {
  const n = Number(v);
  return Number.isFinite(n)
    ? `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : "$0.00";
};

const shortDate = (v) => {
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? v : d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
};

const fullDate = (v) => {
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? "-" : d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

function App() {
  const [strategy, setStrategy] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [trades, setTrades] = useState([]);
  const [history, setHistory] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async (showRefresh = false) => {
    try {
      if (showRefresh) setRefreshing(true);

      const [strategyRes, portfolioRes, tradesRes, historyRes] = await Promise.all([
        axios.get(`${API}/api/strategy/${symbol}`),
        axios.get(`${API}/api/portfolio`),
        axios.get(`${API}/api/trades`),
        axios.get(`${API}/api/stock/${symbol}/history`),
      ]);

      const p = portfolioRes.data || {};
      setStrategy(strategyRes.data || {});
      setPortfolio({
        ...p,
        holdings: Array.isArray(p.holdings) ? p.holdings : [],
      });
      setTrades(Array.isArray(tradesRes.data?.trades) ? tradesRes.data.trades : []);

      const values = Array.isArray(historyRes.data?.values) ? historyRes.data.values : [];
      setHistory(
        values.slice().reverse().map((item) => ({
          date: item.datetime,
          price: Number(item.close),
        })).filter((item) => Number.isFinite(item.price))
      );

      setLastUpdated(new Date());
      setMessage("");
      setMessageType("");
    } catch (error) {
      console.error("Failed to load data:", error);
      setMessage(error.response?.data?.message || "Unable to load trading data. Check that the backend is running.");
      setMessageType("error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleTrade = async (type) => {
    try {
      setMessage("");
      setMessageType("");

      const price = Number(strategy?.currentPrice);
      const qty = Number(quantity);

      if (!Number.isFinite(qty) || qty <= 0) {
        setMessage("Quantity must be greater than 0.");
        setMessageType("error");
        return;
      }

      if (!Number.isFinite(price) || price <= 0) {
        setMessage("Current price is not available.");
        setMessageType("error");
        return;
      }

      const res = await axios.post(`${API}/api/trade/${type}`, {
        symbol,
        quantity: qty,
        price,
      });

      setMessage(res.data?.message || `${type.toUpperCase()} completed successfully.`);
      setMessageType("success");
      await loadData();
    } catch (error) {
      setMessage(error.response?.data?.message || "Trade failed. Please try again.");
      setMessageType("error");
    }
  };

  useEffect(() => {
    loadData();
    const timer = setInterval(() => loadData(), 30000);
    return () => clearInterval(timer);
  }, []);

  const signalClass = useMemo(() => {
    const s = String(strategy?.signal || "HOLD").toLowerCase();
    return s === "buy" ? "buy" : s === "sell" ? "sell" : "hold";
  }, [strategy]);

  if (loading && !strategy) {
    return (
      <div className="loading-screen">
        <div className="loading-orb">↗</div>
        <h2>Loading Trading Bot</h2>
        <p>Connecting to your market data...</p>
      </div>
    );
  }

  const plPositive = Number(portfolio?.totalProfitLoss || 0) >= 0;

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">↗</div>
          <div>
            <div className="brand-name">Trading Bot</div>
            <div className="brand-subtitle">Smart virtual trading workspace</div>
          </div>
        </div>
        <div className="market-status">
          <span className="status-dot" />
          <span>Market data connected</span>
          <span className="status-divider">•</span>
          <span>{symbol}</span>
        </div>
      </header>

      <main className="dashboard">
        <section className="hero">
          <div className="hero-content">
            <div className="eyebrow">INTELLIGENT TRADING WORKSPACE</div>
            <h1>Trade smarter.<br /><span>See the market clearly.</span></h1>
            <p className="hero-copy">
              Track {symbol}, understand the EMA + RSI strategy, monitor your virtual portfolio
              and simulate trades from one clean dashboard.
            </p>

            <div className="hero-meta">
              <div className="hero-symbol">
                <span className="symbol-icon">A</span>
                <div><strong>{symbol}</strong><span>Apple Inc.</span></div>
              </div>

              <div className="hero-price">
                <span>Live price</span>
                <strong>{money(strategy?.currentPrice)}</strong>
              </div>

              <div className={`signal-pill ${signalClass}`}>
                <span className="signal-dot" />
                {strategy?.signal || "HOLD"}
              </div>
            </div>
          </div>

          <div className="hero-art">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="orbit orbit-three" />
            <div className="hero-core">↗</div>
          </div>
        </section>

        <section className="summary-grid">
          <div className="summary-card">
            <div className="card-label">Virtual Balance</div>
            <div className="card-value">{money(portfolio?.balance)}</div>
            <div className="card-note">Available cash</div>
          </div>
          <div className="summary-card featured">
            <div className="card-label">Portfolio Value</div>
            <div className="card-value">{money(portfolio?.totalPortfolioValue)}</div>
            <div className="card-note">Cash + holdings</div>
          </div>
          <div className="summary-card">
            <div className="card-label">Total P/L</div>
            <div className={`card-value ${plPositive ? "positive" : "negative"}`}>
              {plPositive ? "+" : ""}{money(portfolio?.totalProfitLoss)}
            </div>
            <div className="card-note">Current unrealized P/L</div>
          </div>
        </section>

        <section className="workspace-grid">
          <div className="panel strategy-panel">
            <div className="panel-heading">
              <div><span className="section-kicker">ANALYSIS</span><h2>{symbol} Strategy</h2></div>
              <div className={`mini-signal ${signalClass}`}>{strategy?.signal || "HOLD"}</div>
            </div>

            <div className="metric-grid">
              <div className="metric"><span>Current Price</span><strong>{money(strategy?.currentPrice)}</strong></div>
              <div className="metric"><span>EMA 9</span><strong>{money(strategy?.ema9)}</strong></div>
              <div className="metric"><span>EMA 21</span><strong>{money(strategy?.ema21)}</strong></div>
              <div className="metric"><span>RSI 14</span><strong>{Number(strategy?.rsi || 0).toFixed(2)}</strong></div>
            </div>

            <div className="strategy-footer">
              <div><span>Signal logic</span><strong>EMA 9 + EMA 21 + RSI 14</strong></div>
              <div className="last-update">Updated {lastUpdated ? lastUpdated.toLocaleTimeString() : "-"}</div>
            </div>
          </div>

          <div className="panel order-panel">
            <div className="panel-heading">
              <div><span className="section-kicker">VIRTUAL ORDER</span><h2>Place Trade</h2></div>
              <span className="order-symbol">{symbol}</span>
            </div>

            <div className="order-price">
              <span>Execution price</span>
              <strong>{money(strategy?.currentPrice)}</strong>
            </div>

            <label className="quantity-label" htmlFor="quantity">Quantity</label>
            <input
              id="quantity"
              className="quantity-input"
              type="number"
              min="1"
              step="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />

            <div className="trade-buttons">
              <button className="trade-button buy-button" onClick={() => handleTrade("buy")}>BUY</button>
              <button className="trade-button sell-button" onClick={() => handleTrade("sell")}>SELL</button>
            </div>

            {message && (
              <div className={`trade-message ${messageType}`}>
                <span>{messageType === "success" ? "✓" : "!"}</span>{message}
              </div>
            )}
          </div>
        </section>

        <section className="panel chart-panel">
          <div className="panel-heading chart-heading">
            <div><span className="section-kicker">MARKET HISTORY</span><h2>{symbol} Price Chart</h2></div>
            <div className="chart-info"><span className="chart-line" />Daily close</div>
          </div>

          <div className="chart-wrap">
            {history.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history} margin={{ top: 15, right: 12, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="4 6" stroke="#252b3d" vertical={false} />
                  <XAxis dataKey="date" tickFormatter={shortDate} tick={{ fill: "#7f89a3", fontSize: 12 }} axisLine={false} tickLine={false} minTickGap={40} />
                  <YAxis domain={["auto", "auto"]} tick={{ fill: "#7f89a3", fontSize: 12 }} axisLine={false} tickLine={false} width={55} />
                  <Tooltip
                    contentStyle={{ background: "#111522", border: "1px solid #2b3247", borderRadius: "12px", color: "#fff" }}
                    labelStyle={{ color: "#9ba5bd", marginBottom: "5px" }}
                    labelFormatter={fullDate}
                    formatter={(value) => [money(value), "Price"]}
                  />
                  <Line type="monotone" dataKey="price" stroke="#8b72ff" dot={false} strokeWidth={3} activeDot={{ r: 5, strokeWidth: 2, fill: "#8b72ff" }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-chart">No historical price data available.</div>
            )}
          </div>
        </section>

        <section className="content-grid">
          <div className="panel">
            <div className="panel-heading">
              <div><span className="section-kicker">YOUR ACCOUNT</span><h2>Holdings</h2></div>
              <span className="count-badge">{portfolio?.holdings?.length || 0}</span>
            </div>

            {portfolio?.holdings?.length > 0 ? (
              <div className="table-wrap">
                <div className="holding-row holding-head">
                  <span>Asset</span><span>Qty</span><span>Avg. Price</span><span>Current</span><span>P/L</span>
                </div>

                {portfolio.holdings.map((holding) => (
                  <div className="holding-row" key={holding.symbol}>
                    <div className="asset-cell">
                      <div className="asset-icon">{holding.symbol.charAt(0)}</div>
                      <div><strong>{holding.symbol}</strong><span>Equity</span></div>
                    </div>
                    <span>{holding.quantity}</span>
                    <span>{money(holding.averagePrice)}</span>
                    <span>{money(holding.symbol === symbol ? strategy?.currentPrice : holding.currentPrice)}</span>
                    <strong className={Number(holding.profitLoss) >= 0 ? "positive" : "negative"}>
                      {Number(holding.profitLoss) >= 0 ? "+" : ""}{money(holding.profitLoss)}
                    </strong>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">◎</div>
                <strong>No holdings yet</strong>
                <span>Use the BUY button above to create your first virtual position.</span>
              </div>
            )}
          </div>

          <div className="panel">
            <div className="panel-heading">
              <div><span className="section-kicker">ACTIVITY</span><h2>Trade History</h2></div>
              <span className="count-badge">{trades.length}</span>
            </div>

            {trades.length > 0 ? (
              <div className="trade-list">
                {trades.map((trade) => (
                  <div className="trade-item" key={trade._id}>
                    <div className={`trade-type ${trade.type === "BUY" ? "buy" : "sell"}`}>{trade.type}</div>
                    <div className="trade-main">
                      <strong>{trade.symbol}</strong>
                      <span>{trade.quantity} × {money(trade.price)}</span>
                    </div>
                    <div className="trade-pl">
                      <span>P/L</span>
                      <strong className={Number(trade.profitLoss) >= 0 ? "positive" : "negative"}>
                        {Number(trade.profitLoss) >= 0 ? "+" : ""}{money(trade.profitLoss)}
                      </strong>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state compact">
                <div className="empty-icon">↔</div>
                <strong>No trades yet</strong>
                <span>Your executed virtual orders will appear here.</span>
              </div>
            )}
          </div>
        </section>

        <div className="bottom-bar">
          <div>
            <strong>Trading Bot</strong>
            <span>Virtual trading only • Data powered by your existing backend</span>
          </div>
          <button className="refresh-button" onClick={() => loadData(true)} disabled={refreshing}>
            {refreshing ? "Refreshing..." : "↻ Refresh Data"}
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;
