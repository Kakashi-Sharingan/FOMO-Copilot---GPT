# ◈ FOMO Copilot

**A browser-based crypto market research and paper-trading lab built for learning, discipline, and transparent risk management.**

> **Prototype · Simulation only.** FOMO Copilot does not place real trades, connect to wallets or exchanges, guarantee returns, or provide financial advice.

## What is FOMO Copilot?

FOMO Copilot is a lightweight, mobile-friendly dashboard for experimenting with trading research without putting real capital at risk. It combines public market data, technical indicator heuristics, a simulated $20 portfolio, risk controls, and a decision journal.

**Project status:** paper-only research prototype with a functional browser-local simulation workflow. This is not a validated profitable strategy, production exchange integration, or unattended 24/7 trading service.

## Features

| Feature | What it does | Important limitation |
| --- | --- | --- |
| BTC, ETH & SOL market watch | Fetches public USD spot quotes from CoinGecko, approximately once per minute while open | Informational prices, not executable quotes |
| Technical signal lab | Uses public 15-minute Binance candles to calculate EMA 9/21/50, RSI 14, MACD 12/26/9 and relative volume | Heuristic labels, not backtested predictions; API availability varies |
| Paper portfolio | Starts with a fictional $20 balance and journals outcomes | No real money or exchange fills |
| Risk controls | Targets 1% maximum planned loss per trade (up to $0.20), a $0.60 daily realized-loss circuit breaker, and one open position | Sampled prices can gap past stops; realized loss can exceed planned limits |
| Simulated SOL position | Tracks hypothetical stop and target against sampled public quotes while the page is open | Not continuous monitoring or real execution |
| Fictional candidate gate | Demonstrates checks for trend, liquidity, safety, data freshness, fees, volume and reward/risk | Scenarios are hard-coded; **not actual token screening** |
| Research journal | Records primary/experimental decisions and notes; supports JSON export/import of research logs | Stored locally per browser/device; no cloud sync |
| On-demand daily brief | Summarizes local simulated trading activity | No automatic email or push notification |

## Try the demo

**GitHub Pages:** https://kakashi-sharingan.github.io/FOMO-Copilot---GPT/

*The link will work only after GitHub Pages has been enabled and deployed for this repository.*

You can also download `index.html` and open it in a modern browser. Public market APIs require internet access and may block local-file requests.


## Live-price shadow paper simulation (opt-in)

The **Live-price paper simulation** panel uses public Binance SOL/USDT reference bid/ask quotes and completed five-minute candles. It can open one isolated simulated position per explicitly enabled session, mark that position against sampled quotes, and automatically simulate a stop-loss or take-profit exit while the browser tab is visible and online. No exchange orders are submitted. No original primary or isolated paper-account balances or journals are changed by this feature.

- Starts with a separate fictional $20 shadow ledger in browser localStorage (`fomo_live_shadow_v1`). Its balances are **not** your main paper balance.
- Simulated entries use deterministic research filters, a shared paper-position gate, a maximum $5 notional, a modeled 1% stop and 2% target, and assumed 0.1% fees and 0.1% adverse slippage each way. These assumptions are not verified exchange execution costs. Six independent live agents are **not** implemented.
- New entries are limited to 60 checks per session. **An already-open position continues to be monitored beyond 60 checks**, so it is not abandoned at the entry limit. Closing the tab, hiding it, going offline, or a stale quote can pause monitoring and leave a shadow position open; no exchange-side stop exists.
- An explicit new session can resume monitoring a previously open shadow position. Cumulative realized shadow P/L is not reset when monitoring restarts; loss limits remain in effect for subsequent entries.
- Exports include up to 120 recent routine price marks and up to 500 important audit events (entry, exit, session control, rejection). Events already pruned by earlier versions cannot be restored. Use **Export live test JSON** and confirm the file appears in browser downloads.
- Local browser storage can be cleared by browser settings or quota failures; export frequently. Never use browser reset controls as a substitute for closing a simulated position and preserving its audit history.

**Local verification:** run `node tests/smoke.cjs` to exercise the shared paper gate, opt-in entry, rejection, extended position monitoring, audit retention, simulated stop exit, and export without network access. This test is not a live-browser or exchange integration test.

## Getting started

1. Open the hosted demo or `index.html`.
2. Review the simulation disclaimer and public market feed status.
3. Inspect BTC, ETH, and SOL market data and the technical signal lab.
4. Use the fictional candidate gate to understand why a hypothetical trade passes or fails.
5. Experiment with the paper portfolio and review the journal.
6. Export your research log periodically to avoid losing notes when browser storage is cleared.

**Privacy:** Paper portfolio data and research notes are stored in browser `localStorage`. The hosted site does not provide accounts or server-side synchronization. Opening the site on a different device or origin starts a separate local dataset.

## How signals work

The experimental technical signal lab uses 15-minute candlestick data and a simple combination of moving-average trend, momentum (RSI and MACD), and relative volume checks. Labels such as **BULLISH SETUP**, **BEARISH SETUP**, **UPTREND WATCH**, and **WAIT / NO TRADE** are descriptive heuristics—not recommendations, confidence probabilities, or proven profitable signals.

The *fictional candidate gate* is a separate educational simulation. Its liquidity, safety, and fee fields are preset scenario assumptions and **must not** be interpreted as checks on real tokens.

## Risk philosophy

- Paper trade before risking real money.
- Avoid leverage and borrowed funds.
- Reject unknown liquidity, token safety, execution costs, or stale data.
- Account for fees, spread, slippage, and missed fills.
- Review losing decisions instead of automatically increasing risk.
- Keep the app educational until its market data, assumptions, and execution paths are independently verified.

The example **0.2% round-trip fee** is an illustrative assumption, **not** a verified fee for fomo.family or any exchange.

## Tech stack

- HTML, CSS, and vanilla JavaScript
- Browser `localStorage` for paper state and research notes
- CoinGecko public spot-price API
- Binance public 15-minute market-candle API
- GitHub Pages for static hosting

No backend, paid hosting, API key, or wallet connection is required for the current prototype.

## Deploy on GitHub Pages

1. Create a **public** repository named `FOMO-Copilot---GPT`.
2. Upload `index.html` and this `README.md` to the repository root on the `main` branch.
3. Navigate to **Settings → Pages → Build and deployment**.
4. Select **Deploy from a branch**, choose `main` and `/(root)`, then save.
5. After deployment, open the demo URL above.

To update the application, replace **the same `index.html` file** and commit. The public URL stays the same. Never commit private keys, seed phrases, credentials, or personal trading data.

## Roadmap

- [ ] Interactive candlestick chart with EMA overlays
- [ ] Explainable signal checklist: clear reasons for WAIT / NO TRADE
- [ ] Better API failure handling and data-freshness checks
- [ ] Manual strategy backtesting and outcome review
- [ ] Improved accessibility and responsive mobile UI
- [ ] Optional privacy-conscious data export/backup
- [ ] Explore notifications only with appropriate hosted infrastructure and opt-in

These are planned ideas, not implemented capabilities.

## Contributing

Feedback, bug reports, and pull requests are welcome. For issues, include the browser, device, reproduction steps, expected behavior, and actual behavior. **Do not share wallet secrets, API keys, or personal financial records.**

Suggested contribution areas: accessibility, charting, market-data reliability, tests, risk disclosure, and documentation.

## Project scope and disclaimer

FOMO Copilot is an independent educational prototype and is **not affiliated with or endorsed by** fomo.family, CoinGecko, or Binance. Market feeds can be delayed, unavailable, or rate-limited. The application does not perform live contract safety audits, background scanning, automated execution, or iPhone push notifications.

**Nothing in this repository is investment advice. Trading cryptoassets can result in significant losses.**

## License

**No license has been selected yet.** Until the repository owner chooses one, standard copyright rules apply. Contributors should not assume permission to reuse or redistribute the code outside GitHub's applicable terms.