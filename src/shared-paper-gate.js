/* Shared fail-closed browser-local paper entry gate. Read-only storage access. */
(function(g){'use strict';
const PRIMARY='fomo_copilot_paper_v2',ISOLATED='fomo_isolated_execution_v1';
function inspect(){const stores=[];for(const key of [PRIMARY,ISOLATED]){let raw;try{raw=localStorage.getItem(key);}catch(e){return {allowed:false,reason:'Storage inaccessible: '+e.message,stores};}
if(raw===null){stores.push({key,status:'absent',position:false});continue;}
let data;try{data=JSON.parse(raw);}catch(e){return {allowed:false,reason:'Unparseable account '+key,stores};}
if(!data||typeof data!=='object'||Array.isArray(data)||!Array.isArray(data.journal)){return {allowed:false,reason:'Malformed account '+key,stores};}
if(data.position!==null&&data.position!==undefined&&(typeof data.position!=='object'||Array.isArray(data.position))){return {allowed:false,reason:'Malformed position '+key,stores};}
if(key===PRIMARY&&g.FomoLocalState&&!g.FomoLocalState.validPrimary(data))return {allowed:false,reason:'Invalid primary account values',stores};
if(key===ISOLATED&&g.FomoLocalState&&!g.FomoLocalState.validIsolated(data))return {allowed:false,reason:'Invalid isolated account values',stores};
stores.push({key,status:'present',position:!!data.position});}
const occupied=stores.filter(s=>s.position);return {allowed:occupied.length===0,reason:occupied.length?'Position already exists in '+occupied.map(x=>x.key).join(', '):'No open positions in either known paper ledger',stores};}
function authorizeEntry(){const result=inspect();return result;}
g.FomoSharedPaperGate=Object.freeze({inspect,authorizeEntry});
})(typeof globalThis!=='undefined'?globalThis:this);
