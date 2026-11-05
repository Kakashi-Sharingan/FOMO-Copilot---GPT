# FOMO AI Trading Copilot — Living Technical & User Guide

**Maintained documentation · 5 November 2026**  
**Created & developed by Ayushman Adhikary**

> **Prototype and simulation only.** No real-money order execution. Research scores and paper results do not establish profitability. This guide describes the current repository implementation and known limitations; update it alongside feature changes.

## Overview

FOMO Copilot is a GitHub Pages-hosted, browser-based cryptocurrency research and paper-trading dashboard. The interface consolidates market discovery, candle-based indicators, charts, agent-style decision assessments, risk screening, and a separate simulated portfolio. It uses client-side JavaScript; a static GitHub Pages site is **not** a continuously running trading server.

Live dashboard: https://kakashi-sharingan.github.io/FOMO-Copilot---GPT/

## User workflow

1. Open the dashboard and keep it open while you want automatic refreshes and monitoring.
2. The **Dynamic Market Opportunity Scanner** samples liquid USDT markets and ranks up to eight candidates using recent activity, volatility, and momentum. Rankings are research leads, not buy instructions.
3. **Real Candle-Based Signal Lab** analyzes market candles and displays technical values.
4. **Interactive 15-minute Candlestick Charts** display one selected coin at a time, with left/right navigation.
5. **Multi-Agent Decision Council** shows the selected coin's assessments, synchronized with chart selection. The Skeptic challenges adverse scenarios; noncritical objections may be outweighed, but mandatory safety gates cannot.
6. **Autonomous Paper-Trading Readiness / Agent-to-Execution Safety Gate** displays why entries are blocked or screened. A liquidity-screen pass is **not** approval for automatic execution.
7. **Isolated $20 Paper Execution Simulator** supports manual test positions, simulated closing, realized P&L, and a journal. An artificial TESTUSDT example can produce artificial gains; reset before realistic tests.
8. **Automatic simulated stop-loss/take-profit monitoring** can check supported market-pair quotes roughly every 15 seconds while the page is open. The test settings previously used were a 2% stop and 4% target; check the current controls before relying on these assumptions.
9. **Monitoring History** stores recent checks in the browser (up to 120 saved; the panel displays a recent subset), including time, indicative bid, stop, target, and exit flag. An automatic exit notice describes triggered exits.

## Automatic updates and persistence

Research modules are configured to refresh approximately every **five minutes** while the page is open. Chart candles are 15-minute intervals, so displayed candle values may not change at each refresh. Browser throttling, network failures, and closing the page can delay or stop updates. Some state and monitoring history are stored in browser local storage; changing browsers, clearing site data, or using private browsing may remove that history. There is no guaranteed cloud synchronization.

## Market data and execution caveats

- Scanner market coverage is a **sample** of higher-turnover pairs, not an exhaustive search of all assets.
- The spread/liquidity screen requests an indicative 20-level order book for each candidate. Its initial research thresholds are **spread ≤ 0.25%** and **at least 10,000 USDT visible notional depth on each side**.
- Displayed order-book depth is not guaranteed executable liquidity. Depth can disappear; latency, slippage, order size, fees, minimum order sizes, and exchange availability matter.
- The screening status must remain **fail-closed** if market data is missing, stale, malformed, or unverifiable.
- Current automatic paper **entries remain disabled**. The simulator supports manual entries and monitored automatic exits, not an independently verified autonomous strategy.
- A simulated exit is not a guaranteed stop: the page must remain open and a usable quote must arrive. No real exchange orders are sent.

## Risk and decision architecture

**Scanner → candle/technical research → agent assessments (including Skeptic) → mandatory safety gate → paper simulator.**

The gate is intended to enforce verified bid/ask, execution fees, slippage assumptions, liquidity, position sizing, exposure, and daily drawdown. At the time of this documentation, **full end-to-end enforcement and autonomous entries have not been verified or enabled**. Agent agreement cannot bypass missing critical safety information.

## Interface notes

The live research sections are consolidated into a responsive dashboard. Chart and council views are synchronized to the selected coin. The developer signature belongs in the final footer. In the simulator, the requested informational styling is **green for “No automatic exit triggered yet”** and **red for “No simulated orders entered.”** These colors do not indicate profitability or a connected monitoring feed; verify the last-check timestamp separately.

## Validation checklist

- Refresh the live site with **Ctrl+Shift+R** after GitHub Pages deploys a change.
- Confirm scanner candidates, chart navigation, synchronized council selection, and updated research timestamps.
- Confirm the safety gate shows market screening results but **zero autonomous entries approved** until required controls are implemented and tested.
- Use TESTUSDT for a manual open/close accounting check; distinguish fabricated test prices from live quotes.
- For supported pairs, check monitoring timestamps and new history rows. Do not expect automatic exits without a stop/target trigger.
- Verify journal records, cost assumptions, P&L calculations, browser reload persistence, and behavior when data or storage is unavailable.

## Next development milestones

1. Validate data freshness and order-book integrity, and add conservative executable-cost models (fees and slippage).
2. Enforce per-position limits, max concurrent exposure, drawdown limits, and duplicate-entry protection in the execution engine.
3. Link selected council decisions to the execution gate with traceable rejection reasons.
4. Add controlled, opt-in **automatic paper entries** only after tests pass; keep real-money execution disabled.
5. Backtest and forward-test against realistic costs, then report net performance, drawdowns, and failure cases.
6. For genuine 24/7 operation, design a separate hosted background worker with monitoring and secure state storage.

## Maintenance policy

Treat this file as a living guide. For each meaningful code change, update the relevant feature description, limitations, and validation steps in the **same development cycle**. A successful GitHub commit does not by itself prove that GitHub Pages has deployed or that a browser has loaded the new version.
