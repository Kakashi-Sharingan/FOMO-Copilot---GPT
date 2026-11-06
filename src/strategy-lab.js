/* Original research-only strategy lab. Never writes trading storage or places orders. */
(()=>{'use strict';
const $=id=>document.getElementById(id),E=window.FomoResearchEngine;
const root=$('fomoStrategyLab');if(!root||!E)return;
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let last=null;
const render=(message,detail='')=>{$('fomoLabResult').textContent=message;$('fomoLabDetail').textContent=detail;};
function indicators(c){const closes=c.map(x=>x.close);return {rsi:E.rsi(closes),fast:E.ema(closes,12),slow:E.ema(closes,50),atr:E.atr(c)};}
function review(c){
 const base=E.evaluate(c),last=c.at(-1),i=indicators(c);
 const recent=c.slice(-5),prior=c.slice(-25,-5),avg=prior.length?prior.reduce((a,x)=>a+x.volume,0)/prior.length:0;
 const volumeRatio=avg>0?recent.at(-1).volume/avg:null;
 const pump=last&&c.length>5?(last.close/c.at(-6).close-1)*100:null;
 const trend=base.regime==='uptrend'&&i.fast>i.slow&&i.rsi>=48&&i.rsi<=68;
 const breakout=c.length>22&&last.close>Math.max(...c.slice(-21,-1).map(x=>x.high))&&volumeRatio!==null&&volumeRatio>=1.2;
 const meanReversion=base.regime==='range'&&i.rsi<35;
 const candidates=[
  {name:'Trend continuation',match:trend,reason:'EMA alignment and moderate RSI'},
  {name:'Volume-confirmed breakout',match:breakout,reason:'Close above prior 20-candle high and relative volume'},
  {name:'Range mean reversion',match:meanReversion,reason:'Range regime and low RSI; requires independent reversal confirmation'}
 ];
 const vetoes=[];
 if(base.regime==='unknown'||base.regime==='dislocated')vetoes.push('Unknown/dislocated market regime');
 if(pump!==null&&pump>3)vetoes.push('5-candle price surge exceeds 3%: anti-chase veto');
 if(volumeRatio===null)vetoes.push('Missing volume baseline');
 if(!Number.isFinite(i.atr)||i.atr<=0)vetoes.push('ATR unavailable');
 const active=candidates.filter(x=>x.match);
 const votes=[
  {role:'Scanner',vote:active.length?'RESEARCH':'SKIP',reason:active.map(x=>x.name).join(', ')||'No qualifying setup'},
  {role:'Anti-FOMO',vote:vetoes.length?'BLOCK':'PASS',reason:vetoes.join('; ')||'No research veto detected'},
  {role:'Sizer',vote:'BLOCK',reason:'No verified account-wide equity and executable stop budget'},
  {role:'Paper Buyer',vote:'BLOCK',reason:'Depth, fees and live executable quote not verified'},
  {role:'Logger',vote:'PASS',reason:'Research-only evidence recorded in this view'},
  {role:'Prediction research',vote:'SKIP',reason:'No sourced event probability'}
 ];
 return {base,candidates,votes,vetoes,pump,volumeRatio,authorization:'BLOCKED — RESEARCH ONLY',time:last.time,close:last.close};
}
function retrospective(c){
 // Walk-forward diagnostics, not an execution backtest. No future candle enters signal calculation.
 const observations=[];for(let j=51;j<c.length-1;j++){
  const r=review(c.slice(0,j+1));if(r.candidates.some(x=>x.match)&&!r.vetoes.length){
   const forward=(c[j+1].close/c[j].close-1)*100;
   observations.push({time:c[j].time,forwardPct:forward});
  }
 }
 const mean=observations.length?observations.reduce((a,x)=>a+x.forwardPct,0)/observations.length:null;
 return {sample:observations.length,meanForwardPct:mean,disclaimer:'One-candle directional research diagnostic only; NOT a backtest or simulated P&L. No fees, fill model, stops or position sizing.'};
}
async function load(){
 const symbol=$('fomoLabSymbol').value,btn=$('fomoLabRun');btn.disabled=true;render('Fetching closed 15-minute candles…');
 try{
  if(!/^[A-Z0-9]{2,20}USDT$/.test(symbol))throw Error('Invalid symbol');
  const sources=['https://data-api.binance.vision','https://api.binance.com','https://api1.binance.com'];
  let rows=null,provider='',failures=[];
  for(const host of sources){const ctl=new AbortController(),timer=setTimeout(()=>ctl.abort(),7000);
   try{const response=await fetch(host+'/api/v3/klines?symbol='+encodeURIComponent(symbol)+'&interval=15m&limit=300',{signal:ctl.signal,cache:'no-store'});
    if(!response.ok)throw Error('HTTP '+response.status);
    const payload=await response.json();if(!Array.isArray(payload)||!payload.length||!Array.isArray(payload[0]))throw Error('Invalid candle response');
    rows=payload;provider=host;break;
   }catch(e){failures.push(host+': '+String(e.message||e));}finally{clearTimeout(timer);}
  }
  if(!rows)throw Error('All public candle providers failed. '+failures.join(' | '));
  const now=Date.now(),candles=E.normalizeCandles(rows.map(x=>({time:Number(x[0]),open:Number(x[1]),high:Number(x[2]),low:Number(x[3]),close:Number(x[4]),volume:Number(x[5]),closed:Number(x[6])<now})));
  if(candles.length<55)throw Error('Not enough closed candles');
  if(now-(candles.at(-1).time+900000)>45*60000)throw Error('Stale candle data');
  last={symbol,provider,candles,review:review(candles),retro:retrospective(candles)};
  const r=last.review;
  render(symbol+' · '+r.base.regime.toUpperCase()+' · '+r.authorization,
   'Data provider: '+provider+' | Last closed candle: '+new Date(r.time).toLocaleString()+' | Close '+r.close+' | RSI '+r.base.indicators.rsi14.toFixed(1)+' | ATR '+r.base.indicators.atrPct.toFixed(2)+'%\n'+
   'Candidate strategies:\n'+r.candidates.map(x=>(x.match?'RESEARCH':'SKIP')+' — '+x.name+': '+x.reason).join('\n')+'\n'+
   'Agent evidence:\n'+r.votes.map(x=>x.role+' '+x.vote+': '+x.reason).join('\n')+'\n'+
   'Research vetoes: '+(r.vetoes.join('; ')||'None detected')+'\n'+
   'Walk-forward one-candle research observations: '+last.retro.sample+' | Mean forward change: '+(last.retro.meanForwardPct===null?'N/A':last.retro.meanForwardPct.toFixed(3)+'%')+'\n'+last.retro.disclaimer);
 }catch(e){render('Research unavailable — no trade',String(e.message||e));}finally{btn.disabled=false;}
}
$('fomoLabRun').addEventListener('click',load);
$('fomoLabExport').addEventListener('click',()=>{if(!last)return;const data={version:1,mode:'read-only research',created:new Date().toISOString(),symbol:last.symbol,provider:last.provider,review:last.review,retrospective:last.retro};const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='fomo-research-'+last.symbol+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
})();
