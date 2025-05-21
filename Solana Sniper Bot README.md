# 🔫 Solana Sniper Bot – High-Speed Token Sniping & Trading (Per Week 💲10k+)
> For paid sniper bot builds or Solana consulting, contact me.
 ---
An ultra-fast, MEV-enabled **Solana Sniper Bot** built in **Node.js**.  
This bot automates token sniping, buying, and selling on the **Solana blockchain**, using **gRPC**, **Jito Tips**, and private relays like **Nozomi** and **0xBlock** to ensure top-tier execution.

> Ideal for memecoin sniping, liquidity sniping, pre-launch tracking, and stealth token buying with max priority and speed.


---

![solana sniper bot (pump)](https://github.com/user-attachments/assets/b146456d-1b68-49e5-b9f7-cf0f675fc77a)
---
## 🚀 Why Use This Solana Sniper Bot?

- 🔄 Real-time Solana DEX monitoring using gRPC
- 💸 MEV-powered transactions with Jito, Nozomi, and 0xBlock
- 🔥 Token launch sniping: buy as soon as liquidity is added
- 🧠 Customizable token filtering: pool burn, mint renounced, liquidity thresholds
- ⚔️ Built-in anti-rug and honeypot protection
- 📡 Telegram bot interface for remote control & alerts

 --- 
![solana sniper (jito)](https://github.com/user-attachments/assets/c12e2ef1-8924-43aa-ac2b-a93923d6a1f5)

---

## 🧠 Core Features

| Feature                              | Description                                                                 |
|--------------------------------------|-----------------------------------------------------------------------------|
| 🎯 **Token Sniping**                 | Snipes newly launched tokens instantly after liquidity is added            |
| ⚡ **gRPC Streaming**                | Uses low-latency gRPC to detect launches faster than public RPC            |
| 💰 **MEV Boost / Priority Tips**    | Supports Jito Tips, Nozomi, 0xBlock for private, high-priority inclusion   |
| 🧪 **Safety Checks**                | Verifies mint status, burn, ownership, liquidity, and more                 |
| 🧵 **Multi-wallet Support**         | Trade from multiple Solana wallets simultaneously                          |
| 🔔 **Telegram Integration**         | Get alerts, trade manually, or manage wallets through Telegram             |

---

## 📈 Keywords for Search Engines (SEO)

```

solana sniper bot, solana trading bot, solana mev bot, jito solana bot,
buy solana tokens fast, solana memecoin sniper, solana dex bot, grpc solana bot,
nozomi solana bot, 0xblock solana tip bot, pump.fun sniper, solana telegram bot

````

---

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/cryptoking-max/solana-sniper-bot.git
cd solana-sniper-bot
````

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure `.env`

Create a `.env` file in the root directory:

```env
####################################
# 🔐 API KEYS & IDENTIFIERS
####################################
TOKEN="..."  # Telegram bot token (contact @cryptoking110600 for support)
BIRD_API_KEY="3570a293.....a9263ab0f95"  # BirdEye API key for token info
INSTANTNODES_API_KEY=""  # InstantNodes API key (optional but recommended)
HELIUS_API=""  # Helius API key for advanced Solana data
SOLSNIFFER_API_KEY=""  # SolSniffer API key for token safety/rug check

####################################
# 🌐 RPC & NETWORK ENDPOINTS
####################################
RPC_URL="https://solana-api.instantnodes.io/token"  # Primary RPC endpoint
RPC_URL1=""  # Secondary RPC endpoint (fallback)

RPC_WEBSOCKET_ENDPOINT="wss://solana-api.instantnodes.io/token"  # Primary WebSocket
RPC_WEBSOCKET_ENDPOINT1="wss://mainnet.helius-rpc.com/?api-key="  # Helius WebSocket (requires key)

####################################
# 🔑 WALLET & AUTH
####################################
PUBLIC_KEY=""  # Public wallet address
PRIVATE_KEY=""  # Private key (keep secret!)
RECIPIENT_ADDRESS=""  # Optional – send proceeds to this wallet
APP_PASS_KEY=""  # Optional – used for local encryption

####################################
# ⚙️ BOT SETTINGS
####################################
PRIORITIZATION_FEE_LAMPORTS=""  # Lamports to prioritize tx (e.g., 5000)
MICRO_PRIORITIZATION_FEE_LAMPORTS=""  # Low gas for test/micro tx

MAX_RETRIES="3"  # Number of retries for failed transactions
RETRY_DELAY="2"  # Delay in seconds between retries

MINIMUM_SOL_FOR_FEES="0.01"  # Min SOL required in wallet to allow transactions
SLIPPAGE_BPS="800"  # Slippage in basis points (800 = 8%)
BUY_AMOUNT="0.01"  # Default amount of SOL or USDC to spend per token

####################################
# 📊 DECIMAL CONFIGURATION
####################################
SOL_DECIMALS="9"  # Fixed decimals for SOL
USDC_DECIMALS="6"  # Fixed decimals for USDC
ACTION_TOKEN_DECIMALS="6"  # Default target token decimals (update dynamically if needed)

####################################
# 🧪 RUG CHECK & SAFETY FILTERS
####################################
MAX_TOP_HOLDERS_PERCENTAGE="30"  # E.g., skip tokens where top holders >30%
MIN_SECURITY_SCORE="70"  # Minimum safety score from SolSniffer or other
MAX_LP_MARKET_CAP_RATIO="1.5"  # LP too high relative to mcap = risky
MIN_LP_MARKET_CAP_RATIO="0.1"  # Too low = illiquid

REQUIRE_LIQUIDITY_LOCK="true"  # Only buy if LP is locked
REQUIRE_MINT_DISABLED="true"  # Only buy if mint is disabled
MIN_SELL_PERCENTAGE="90"  # Reject tokens where <90% can be sold

```

---

## 🚀 Running the Bot

### Basic Mode:

```bash
node bot.js
```

### Custom Strategy Mode:

```bash
node bot.js --strategy=mintRenounced --tipProvider=jito
```

---


## 🛡️ Sniping Conditions & Safety Checks

This bot evaluates tokens before buying to avoid scams or rugs.

* ✅ Burned Pool Address
* ✅ Mint Authority Renounced
* ✅ Verified Creator / Metadata
* ✅ Min Liquidity Requirement
* ✅ Max Market Cap Limit
* ✅ Anti-Honeypot Check
* ✅ Transaction Simulation Support

---

## 📱 Telegram Bot Features (Optional)

You can control and receive notifications from the bot via Telegram.

| Command           | Description                   |
| ----------------- | ----------------------------- |
| `/wallet`         | Check wallet balance          |
| `/buy <address>`  | Manually buy a token          |
| `/sell <address>` | Sell a token                  |
| `/status`         | Show current filters/strategy |
| `/start`          | Restart the bot               |

---

## 🧠 Advanced Config (in `.env` or `config.js`)

```env
BUY_AMOUNT=0.1        # How much SOL to spend per snipe
SLIPPAGE=0.5          # Slippage %
MIN_LIQUIDITY=5       # Minimum liquidity in SOL
BLOCKED_CREATORS=...  # Prevent known rug pullers
```

---

## 💡 Tips for Sniping Success

* Use **private gRPC** endpoints for lowest latency
* Enable **Jito / Nozomi** tips for top-of-block inclusion
* Monitor high-impact wallets and copy-trade them
* Use small, fast wallets to reduce confirmation time
* Don't chase every launch — apply strict filters

---

## 🌐 Future Roadmap

* [ ] UI dashboard with live token stream
* [ ] Auto sell with trailing profit or PNL%
* [ ] Discord webhook support
* [ ] Liquidity add alerts
* [ ] Wallet tracking (copy-trade whales)

---

## ⚠️ Legal Disclaimer

This project is intended for **educational and research purposes only**.
Using this bot on mainnet carries risk. The author is **not responsible** for any financial loss or misuse.

---

## ⭐⭐⭐⭐⭐ Like It? Star It!

If this bot helps you learn or profit:

* ⭐⭐⭐⭐⭐ Star this repository
* 🧠 Suggest features via Issues
* 🔗 Share with other Solana developers or customers

---

## 👨‍💻 Built by \[Cryptoking❤]

* Telegram: [@cryptoking110600](https://t.me/cryptoking110600)
* GitHub: [https://github.com/cryptoking-max](https://github.com/cryptoking-max)
* For paid sniper bot builds or Solana consulting, Feel free to contact me.

---


