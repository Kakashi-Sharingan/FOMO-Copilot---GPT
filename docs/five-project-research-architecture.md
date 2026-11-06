# FOMO Copilot — Five-project research and original architecture (draft)

Research snapshot: 2026-11-06. This document is a design specification, **not** a claim of profitable strategies or completed source-code audit.

## Source repositories reviewed (README-level first pass)
- https://github.com/ccxt/binance-trade-bot — relative coin strength/rotation, USDT bridge, fee-aware rotation; README explicitly warns of freefall risk.
- https://github.com/Open-Trader/opentrader — strategy templates (grid, DCA, RSI, custom), paper trading, historical backtesting, CCXT exchange abstractions.
- https://github.com/iterativv/NostalgiaForInfinity — Freqtrade multi-condition strategy; 5m candles, stablecoin pairs, leveraged-token blacklist. Its suggested 6–12 simultaneous trades and unlimited stake are **incompatible** with our fixed rules.
- https://github.com/whittlem/pycryptobot — configurable technical-analysis trading bot, simulation/testing and operational hygiene; verify details in source before implementation.
- https://github.com/alsk1992/CloddsBot — modular conversational trading terminal, market adapters and multi-source research; its real-money, leverage and wallet functions are **out of scope**.

## Design principles
1. Learn concepts, independently implement original code; no direct dependency or source copy without licensing/security review.
2. Market data adapter must record source, timestamp, symbol, interval, bid, ask, spread, depth status and freshness. Stale or missing values = SKIP.
3. Use closed candles only for signals; maintain separate market regimes: trend, range, volatile/dislocated, unknown.
4. Candidate strategies: trend continuation, confirmed breakout, mean reversion; grid/DCA only as *offline research baselines*, never averaging down in active paper execution.
5. Strategy results must report signal, confidence **calibration status**, reason, invalidation, and estimated execution costs. No indicator count alone can authorize a trade.
6. Six deterministic roles: Scanner (candidate evidence), Anti-FOMO (pump/chase veto), Sizer (risk math), Paper Buyer (execution feasibility), Logger (audit completeness), Prediction Research (separate sourced research or SKIP). These are **not independent AI models**. Unanimous verified approval is mandatory; any SKIP/BLOCK prevents entry.
7. Hard risk policy: one open position maximum; planned stop risk including costs <= 1% equity; valid stop before entry; no increase after losses; no chasing pumps; no concealed losing trades; written reason; any agent disagreement = SKIP.
8. Paper engine only, manual entries only pending verified gates; use indicative bid for stop/target exits and account for fees/slippage/gaps; no exchange keys or wallets.
9. All saved user state is browser-local and must be preserved. Never migrate/reset balances or journals implicitly. Distinguish `fomo_copilot_paper_v2` from `fomo_isolated_execution_v1`.
10. Build on existing `main` branch. Do not introduce live trading, auto entries, or background monitoring claims.

## Planned module boundaries
- Data: candle normalization, timestamp/freshness checks, quote validation, spread/depth quality.
- Features: EMA trend, RSI momentum, ATR volatility, volume anomalies; calculate on complete candles only.
- Regime: deterministic labels with explicit unknown/fail-closed behavior.
- Strategies: independent signal objects with rationale and invalidation.
- Council: structured per-role evidence and vetoes.
- Risk: pure sizing and stop-budget functions; conservative costs.
- Simulation: immutable trade events and auditable journal, preserving legacy storage.
- Evaluation: deterministic fixtures, no lookahead, fee/slippage stress tests, walk-forward and out-of-sample comparisons; measure drawdown, expectancy, profit factor, turnover, exposure and rejection quality.

## Research cautions
- Coin rotation can underperform buy-and-hold and incur two-leg fees.
- Multi-indicator strategies risk overfitting and correlated votes.
- Grid/DCA can increase risk during falling markets and are not automatically allowed.
- Claims of AI autonomy, 100+ strategies, or backtest performance are not evidence of live profitability.
- GitHub Pages cannot host persistent server-side bots; any future backend must be separately designed and secured.

## Build sequence
A. Create original pure data/indicator/regime/strategy modules with no browser-state writes.
B. Add read-only comparative research UI and agent evidence panel.
C. Connect research output to the existing fail-closed paper gate; keep entries disabled.
D. Build offline backtesting fixtures and evaluation harness; comprehensive tests later, with basic checks per change.
E. Investigate balance discrepancy read-only by exposing storage *key presence* and isolated balances without copying or resetting state.

## Open review items
Read strategy source and tests (not just READMEs), verify licenses and maintenance status, establish source attribution for any borrowed algorithms, confirm exchange data coverage and validate performance only on reproducible datasets.
