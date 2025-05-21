import { swap, getBalance, createProvider, loadwallet, rpc_connection } from "./swap.js";
import {
  getLatestCoin,
  token_sell,
  getTokenPrice,
  getSPLTokens,
  token_buy,
  SPL_token_balance,
  getPnl,
  getsplTokeninfo_bird,
  wallet_positions_bird,
} from "./fuc.js";

import dotenv from "dotenv";
import { PublicKey, Keypair } from "@solana/web3.js";
import { readFile, writeFile } from "fs/promises";
import bs58 from "bs58";
import { sleep } from "./fuc.js";
import chalk from "chalk";
import { bot } from "./TGbot.js";
import { timeStamp } from "console";

dotenv.config();
const BUY_AMOUNT = process.env.BUY_AMOUNT;
// Initialize keypair from file
let keypair;
try {
  const keyData = await readFile("keypair.json", "utf8");
  if (!keyData) {
    throw new Error("Empty keypair file");
  }
  const secretKey = new Uint8Array(JSON.parse(keyData));
  keypair = Keypair.fromSecretKey(secretKey);
} catch (error) {
  console.error("Error reading keypair file:", error);
  process.exit(1);
}

// Set up key constants
export const PUBLIC_KEY = keypair.publicKey.toString();

// Add a global flag to control auto sell monitoring
export let isAutoSellRunning = false;

// Function to stop auto sell monitoring
export const stopAutoSell = () => {
  isAutoSellRunning = false;
  console.log(chalk.red("Auto sell monitoring stopped"));
};

// await getBalance();
export const monitoring_sell_all = async () => {
  try {
    const spl_tokens = await wallet_positions_bird(PUBLIC_KEY);
    console.log(chalk.yellow("spl_tokens", spl_tokens));

    // Run all sell operations concurrently
    await Promise.all(spl_tokens.map((token) => token_sell(token.address, 100, token.uiAmount, token.decimals)));

    console.log("sell running...");

    await sleep(2000); // Check every 2 seconds
  } catch (error) {
    console.error("Error monitoring positions:", error);
    await sleep(5000); // Wait before retrying on error
  }
};
export const monitoring_buy_one = async (token, chat_id) => {
  try {
    const blacklistData = await readFile("blacklist.json", "utf8");
    const blacklistedTokens = blacklistData.trim() ? JSON.parse(blacklistData) : [];

    if (blacklistedTokens.includes(token.address)) {
      console.log(`⚠️ Token ${token.symbol} is blacklisted, skipping sell`);
      return;
    }
  } catch (err) {
    console.warn("❌ Could not read blacklist:", err);
    if (err.code === "ENOENT") {
      console.log("No blacklist.json file found, continuing...");
    }
  }
  try {
    const fileData = await readFile("token_trades.json", "utf8");
    const trades = JSON.parse(fileData);

    // Filter previous buy actions for the specific token
    const previousBuys = trades.filter((trade) => trade.address === token.address && trade.action === "buy").map((trade) => trade.price);

    let shouldBuy = true;
    const currentPrice = token.priceUsd;
    // console.log("____previousbuys",previousBuys)

    if (previousBuys.length > 0) {
      // Check if any previous buys don't have a price field
      if (previousBuys.some((price) => price === undefined)) {
        shouldBuy = false;
      } else {
        const minPreviousPrice = Math.min(...previousBuys);
        // console.log(`Minimum previous buy price:${minPreviousPrice}--currentPrice: ${currentPrice}`);
        // Higher price threshold requires bigger dip to buy
        const dipThreshold = currentPrice > 0.00000009 ? 0.1 : 0.6;
        shouldBuy = currentPrice < minPreviousPrice * dipThreshold;

      }
    }
    if (token.address == "So11111111111111111111111111111111111111111") {
      shouldBuy = false;
    }

    if (shouldBuy) {
      console.log("🔄 buy one", token.symbol);
      const txid = await token_buy(token.address, BUY_AMOUNT);
      console.log(`🔵🔵 Token bought 0.00005 sol txid:${txid}- ${token.symbol}`);
      if (txid) {
        try {
          const message = `✅ Buy Transaction Successful!\n\n💰 Amount: 0.00005 SOL\n🔗 <a href="https://solscan.io/tx/${txid}">View Transaction on Explorer</a>\n\n💼 GMGN Wallet: <a href="https://gmgn.ai/sol/address/${PUBLIC_KEY}">View on GMGN</a>`;
          await bot.sendMessage(chat_id, message, { parse_mode: "HTML" });
        } catch (telegramError) {
          console.error("Failed to send Telegram notification:", telegramError);
        }
      }
      return txid;
    }
  } catch (err) {
    console.warn("❌❌Could not read trade history:", err);
    if (err.code === "ENOENT") {
      // await writeFile("token_trades.json", JSON.stringify([]), "utf8");
      console.log("Created new token_trades.json file");
    }
  }
};

const sellToken = async (token, chat_id) => {
  try {
    const blacklistData = await readFile("blacklist.json", "utf8");
    const blacklistedTokens = blacklistData.trim() ? JSON.parse(blacklistData) : [];

    if (blacklistedTokens.includes(token.address)) {
      console.log(`⚠️ Token ${token.symbol} is blacklisted, skipping sell`);
      return;
    }
  } catch (err) {
    console.warn("❌ Could not read blacklist:", err);
    if (err.code === "ENOENT") {
      console.log("No blacklist.json file found, continuing...");
    }
  }
  const pnl = await getPnl(token.address, token.priceUsd, token.uiAmount);
  if (!pnl) return;

  // Load trade history to find buy timestamp
  const fileData = await readFile("token_trades.json", "utf8");
  const trades = fileData.trim() ? JSON.parse(fileData) : [];
  const buyTrade = trades.find((t) => t.address === token.address && t.action === "buy");

  if (!buyTrade) {
    console.log("⚠️ No buy record found, skipping time check.");
    return;
  }
  const buyTime = new Date(buyTrade.time).getTime();
  const timeElapsed = (Date.now() - buyTime) / 1000;
  console.log(`💰 Checking PNL: ${pnl.pnl_percentage.toFixed(2)}% -${token.symbol} - time: ${(timeElapsed / 60).toFixed(2)}min`);

  // Smart selling logic
  const sellAndNotify = async (amount, timeDescription) => {
    console.log(`🎯 Selling at ${pnl.pnl_percentage.toFixed(2)}%- ${amount.toFixed(2)}%-profit (${timeDescription})`);
    const txid = await token_sell(token.address, amount, token.uiAmount, token.decimals);
    if (txid) {
      try {
        const message = `${pnl.pnl_percentage > 0 ? "🟢" : "🔴"} Selling ${amount}% ${token.symbol} at ${pnl.pnl_percentage.toFixed(
          2
        )}% | profit ${pnl.pnl_amount.toFixed(3)} $ (${timeDescription})\n🔗 <a href="https://solscan.io/tx/${txid}">Transaction</a>`;
        await bot.sendMessage(chat_id, message, { parse_mode: "HTML" });
      } catch (telegramError) {
        console.error("Failed to send Telegram notification:", telegramError);
      }
    }
  };

  // Dynamic profit-taking & stop-loss
  if (timeElapsed > 1200 && pnl.pnl_percentage <= -50000) {
    await sellAndNotify(100, "Emergency stop-loss");
  } else if (timeElapsed < 100 && pnl.pnl_percentage >= 500) {
    await sellAndNotify(90, "Small profit secured");
  } else if (pnl.pnl_percentage >= 13000) {
    await sellAndNotify(5, "big profit secured");
  } else if (pnl.pnl_percentage >= 23000) {
    await sellAndNotify(7, "Maximizing gains");
  } else if (pnl.pnl_percentage >= 59000) {
    await sellAndNotify(10, "Moon bag secured");
  }
};

export const monitoring_sell = async (chat_id) => {
  // Set the flag to true when starting
  isAutoSellRunning = true;
  console.log(chalk.green("Auto sell monitoring started"));
  try {
    const message = `🚀Auto sell monitoring started🚀`;
    await bot.sendMessage(chat_id, message);
  } catch (telegramError) {
    console.error("Failed to send Telegram notification:", telegramError);
  }

  while (isAutoSellRunning) {
    try {
      const spl_tokens = await wallet_positions_bird(PUBLIC_KEY);

      // Run all sell operations concurrently
      console.log(chalk.yellow("Monitoring Auto sell running..."));
      await Promise.all(spl_tokens.map((token) => sellToken(token, chat_id)));

      await sleep(2000); // Check every second
    } catch (error) {
      console.error("Error monitoring positions:", error);
      await sleep(1000); // Wait before retrying on error
    }
  }

  console.log(chalk.red("Auto sell monitoring loop exited"));
};
export const monitoring_autotrading = async (chat_id) => {
  // Set the flag to true when starting
  isAutoSellRunning = true;
  console.log(chalk.green("Auto trading started"));
  try {
    const message = `🚀Auto trading started🚀`;
    await bot.sendMessage(chat_id, message);
  } catch (telegramError) {
    console.error("Failed to send Telegram notification:", telegramError);
  }

  while (true) {
    try {
      const spl_tokens = await wallet_positions_bird(PUBLIC_KEY);

      // Run all trading operations concurrently
      console.log(chalk.yellow("Monitoring Auto trading running..."));
      await Promise.all(
        spl_tokens.map(async (token) => {
          await sellToken(token, chat_id);
          await monitoring_buy_one(token, chat_id);
          // await sleep(1000); // Check every 2 seconds
        })
      );

      await sleep(5); // Check every 2 seconds
    } catch (error) {
      console.error("Error monitoring positions:", error);
      await sleep(1000); // Wait before retrying on error
    }
  }
};
export const monitoring_buy_all = async (chat_id) => {
  try {
    while (true) {
      const spl_tokens = await getSPLTokens(PUBLIC_KEY);
      await Promise.all(spl_tokens.map((token) => monitoring_buy_one(token.spl_mint, chat_id)));
      console.log("✅ monitoring and buying all tokens.");
      await sleep(1000);
    }
  } catch (error) {
    console.error("Error in monitoring_buy_all:", error);
  }
};
