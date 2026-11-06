/* FOMO Copilot original read-only research engine. No storage, network or orders. */
(function(global){
'use strict';
const finite=n=>typeof n==='number'&&Number.isFinite(n);
function normalizeCandles(rows){
 if(!Array.isArray(rows))return [];
 return rows.map(r=>({time:Number(r.time??r[0]),open:Number(r.open??r[1]),high:Number(r.high??r[2]),low:Number(r.low??r[3]),close:Number(r.close??r[4]),volume:Number(r.volume??r[5]),closed:r.closed===true})).filter(r=>[r.time,r.open,r.high,r.low,r.close,r.volume].every(finite)&&r.time>0&&r.low>0&&r.high>=Math.max(r.open,r.close)&&r.low<=Math.min(r.open,r.close)&&r.volume>=0&&r.closed).sort((a,b)=>a.time-b.time).filter((r,i,a)=>i===0||r.time!==a[i-1].time);
}
function ema(values,period){if(!Number.isInteger(period)||period<2||values.length<period||values.some(v=>!finite(v)))return null;let e=values.slice(0,period).reduce((a,b)=>a+b,0)/period;for(let i=period;i<values.length;i++)e+=2/(period+1)*(values[i]-e);return e;}
function rsi(values,period=14){if(values.length<=period||values.some(v=>!finite(v)))return null;let gains=0,losses=0;for(let i=1;i<=period;i++){const d=values[i]-values[i-1];gains+=Math.max(d,0);losses+=Math.max(-d,0);}gains/=period;losses/=period;for(let i=period+1;i<values.length;i++){const d=values[i]-values[i-1];gains=(gains*(period-1)+Math.max(d,0))/period;losses=(losses*(period-1)+Math.max(-d,0))/period;}return losses===0?(gains===0?50:100):100-100/(1+gains/losses);}
function atr(candles,period=14){if(candles.length<=period)return null;const tr=[];for(let i=1;i<candles.length;i++){const p=candles[i-1].close,c=candles[i];tr.push(Math.max(c.high-c.low,Math.abs(c.high-p),Math.abs(c.low-p)));}let a=tr.slice(0,period).reduce((x,y)=>x+y,0)/period;for(let i=period;i<tr.length;i++)a=(a*(period-1)+tr[i])/period;return a;}
function evaluate(rows){const candles=normalizeCandles(rows),closes=candles.map(x=>x.close),last=candles.at(-1);if(candles.length<51)return {regime:'unknown',signal:'SKIP',reason:'Insufficient verified closed candles',samples:candles.length};const fast=ema(closes,12),slow=ema(closes,50),momentum=rsi(closes),vol=atr(candles),relativeVol=vol/last.close;if(![fast,slow,momentum,relativeVol].every(finite)||relativeVol<=0)return {regime:'unknown',signal:'SKIP',reason:'Invalid indicator inputs',samples:candles.length};const gap=Math.abs(fast-slow)/last.close;const regime=relativeVol>.08?'dislocated':gap<.002?'range':fast>slow?'uptrend':'downtrend';const signal=regime==='uptrend'&&momentum>=50&&momentum<=68?'RESEARCH_LONG':'SKIP';return {regime,signal,reason:signal==='SKIP'?'Regime or momentum does not qualify':'Trend and momentum candidate; NOT authorized for execution',samples:candles.length,indicators:{ema12:fast,ema50:slow,rsi14:momentum,atr14:vol,atrPct:relativeVol*100},executionAuthorized:false};}
const api=Object.freeze({normalizeCandles,ema,rsi,atr,evaluate});
if(typeof module!=='undefined'&&module.exports)module.exports=api;
else global.FomoResearchEngine=api;
})(typeof globalThis!=='undefined'?globalThis:this);
