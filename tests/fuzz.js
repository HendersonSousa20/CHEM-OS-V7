/* Varredura de entradas extremas: abre cada módulo com campos vazios, 0, negativos, texto, 1e400 e só espaços, aciona todos os botões e procura erros de execução e NaN/Infinity/undefined nas telas. Uso: npm run test:full */
"use strict";
const { JSDOM, VirtualConsole } = require("jsdom");
const BASE = (process.env.CHEMOS_BASE || "http://localhost:8080/") + "index.html";
const errs=[];const vc=new VirtualConsole();vc.on('jsdomError',e=>{const m=String(e.message);if(/cdnjs|ENOTFOUND|Could not load|Not implemented/.test(m+(e.detail||'')))return;errs.push(m.slice(0,160)+' @'+((e.detail&&e.detail.stack||'').split('\n')[1]||'').trim().slice(0,90))});
(async()=>{const d=await JSDOM.fromURL(BASE,{runScripts:'dangerously',resources:'usable',pretendToBeVisual:true,virtualConsole:vc,beforeParse(w){Object.defineProperty(w.HTMLElement.prototype,'innerText',{get(){return this.textContent},set(v){this.textContent=v}});w.AudioContext=function(){};w.matchMedia=()=>({matches:false,addEventListener(){},addListener(){}});w.HTMLCanvasElement.prototype.getContext=()=>new Proxy({},{get:(t,k)=>k==='canvas'?{}:(k==='measureText'?()=>({width:10}):()=>{}),set:()=>true});w.HTMLElement.prototype.scrollIntoView=()=>{};w.confirm=()=>false;w.alert=()=>{};w.fetch=()=>Promise.reject(new Error('offline'));w.URL.createObjectURL=()=>'blob:x';w.URL.revokeObjectURL=()=>{};w.open=()=>null;}});
const w=d.window,doc=w.document,sl=ms=>new Promise(r=>setTimeout(r,ms));for(let i=0;i<240&&!w.CHEMOS_READY;i++)await sl(250);await sl(300);
const BAD=/NaN|Infinity|undefined|\[object|null\b/;
const SKIP=/MENU|FAVORIT|CADERNO|ZERAR|LIMPAR|BAIXAR|COPIAR|PDF|LINK|MAIS|SAIR|PubChem|BUSCAR|CANCELAR|PLAY|PAUSA|INICIAR|SIMUL/i;
const only=process.argv[2]?process.argv[2].split(',').map(Number):[...Array(w.MODULE_MAX)].map((_,i)=>i+1);
const issues=[];process.on('unhandledRejection',e=>{issues.push('rejeição não tratada: '+String(e&&e.message||e).slice(0,160)+' @'+String(e&&e.stack||'').split('\n')[1])});process.on('uncaughtException',e=>{issues.push('exceção: '+String(e&&e.message||e).slice(0,160)+' @'+String(e&&e.stack||'').split('\n')[1])});
const scan=(n,sc)=>{const t=doc.getElementById('screen-content').textContent;const m=t.match(BAD);if(m){const i=t.search(BAD);issues.push(`M${n} [${sc}] texto contém "${m[0]}": …${t.slice(Math.max(0,i-50),i+30).replace(/\s+/g,' ')}…`)}};
for(const n of only){
  for(const sc of ['padrão','vazio','zero','negativo','texto','enorme','espaço']){
    const before=errs.length;
    try{w.renderTool(n);}catch(e){issues.push(`M${n} render lançou: ${e.message}`);continue}
    await sl(60);
    const root=doc.getElementById('screen-content');
    const val={'padrão':null,'vazio':'','zero':'0','negativo':'-5','texto':'abc','enorme':'1e400','espaço':'   '}[sc];
    if(val!==null)root.querySelectorAll('input:not([type=checkbox]):not([type=radio]):not([type=range]):not([type=file]),textarea').forEach(i=>{if(i.id==='cli-input')return;i.value=val;i.dispatchEvent(new w.Event('input',{bubbles:true}));i.dispatchEvent(new w.Event('change',{bubbles:true}))});
    const btns=[...root.querySelectorAll('button')].filter(b=>!SKIP.test(b.textContent)&&!b.disabled);
    for(const b of btns.slice(0,30)){if(!doc.body.contains(b))continue;try{b.click()}catch(e){issues.push(`M${n} [${sc}] clique "${b.textContent.trim().slice(0,25)}" lançou: ${e.message}`)}await sl(15)}
    root.querySelectorAll('select').forEach(s=>{if(s.id==='cli-input')return;for(let k=0;k<s.options.length&&k<8;k++){s.selectedIndex=k;s.dispatchEvent(new w.Event('change',{bubbles:true}));s.dispatchEvent(new w.Event('input',{bubbles:true}))}});
    await sl(40);
    scan(n,sc);
    errs.slice(before).forEach(e=>issues.push(`M${n} [${sc}] erro: ${e}`));
  }
}
const g={};issues.forEach(i=>{const k=i.replace(/^M\d+ \[[^\]]+\] /,'').replace(/…[^…]*…/,'');(g[k]=g[k]||[]).push(i.match(/^M\d+ \[[^\]]+\]/)?.[0]||'')});const ks=Object.keys(g);console.log('CAUSAS DISTINTAS:',ks.length);process.exitCode=ks.length?1:0;ks.forEach(k=>console.log(' -',k.slice(0,260),'\n     em:',[...new Set(g[k])].slice(0,6).join(' ')));process.exit(process.exitCode||0)})();
