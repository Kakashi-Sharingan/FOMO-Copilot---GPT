/* Validation and same-origin locking for browser-local journals. */
(function(g){'use strict';
const object=x=>!!x&&typeof x==='object'&&!Array.isArray(x);
const text=x=>typeof x==='string';
const timestamp=x=>text(x)&&Number.isFinite(Date.parse(x));
function validResearch(x){
 return object(x)&&(x.schema===undefined||x.schema===1)&&Array.isArray(x.decisions)&&Array.isArray(x.lessons)
  &&x.lessons.every(row=>object(row)&&timestamp(row.when)&&text(row.type)&&text(row.note)&&row.note.length<=600)
  &&x.decisions.every(row=>object(row)&&timestamp(row.when)&&['primary','experimental'].includes(row.track)
   &&text(row.candidate)&&text(row.primaryGate)&&Array.isArray(row.reasons)&&row.reasons.every(text)
   &&(row.quoteSOL===null||Number.isFinite(row.quoteSOL))&&text(row.note));
}
function validPrimary(x){
 if(!object(x)||!Number.isFinite(x.balance)||x.balance<0||!Array.isArray(x.journal)
  ||!x.journal.every(row=>object(row)&&Number.isFinite(row.pnl)&&text(row.day)&&text(row.time)&&text(row.name)&&text(row.result)&&text(row.reason)))return false;
 const p=x.position;if(p==null)return true;
 return object(p)&&p.coin==='SOL'&&text(p.name)&&['entry','stop','target','notional'].every(k=>Number.isFinite(p[k])&&p[k]>0)
  &&Number.isFinite(p.feeRate)&&p.feeRate>=0&&p.stop<p.entry&&p.target>p.entry;
}
function validIsolated(x){
 if(!object(x)||!Number.isFinite(x.cash)||x.cash<0||!Number.isFinite(x.realized)||!Array.isArray(x.journal)
  ||!x.journal.every(row=>object(row)&&text(row.time)&&text(row.symbol)&&text(row.action)&&['price','notional','pnl'].every(k=>Number.isFinite(row[k]))))return false;
 const p=x.position;return p==null||(object(p)&&text(p.symbol)&&['entry','qty','notional'].every(k=>Number.isFinite(p[k])&&p[k]>0));
}
function withPaperLock(action){return g.navigator?.locks?.request?g.navigator.locks.request('fomo-paper-ledgers-v1',action):Promise.resolve().then(action);}
g.FomoLocalState=Object.freeze({validResearch,validPrimary,validIsolated,withPaperLock});
})(typeof globalThis!=='undefined'?globalThis:this);
