/* Injeção de HTML: preenche todos os campos (e a linha de comando e a paleta) com cargas de XSS, usa respostas de API falsas contendo HTML e procura elementos injetados. Uso: npm run test:full */
"use strict";
const { JSDOM, VirtualConsole } = require("jsdom");
const BASE = (process.env.CHEMOS_BASE || "http://localhost:8080/") + "index.html";
const vc=new VirtualConsole();
(async()=>{const d=await JSDOM.fromURL(BASE,{runScripts:'dangerously',resources:'usable',pretendToBeVisual:true,virtualConsole:vc,beforeParse(w){Object.defineProperty(w.HTMLElement.prototype,'innerText',{get(){return this.textContent},set(v){this.textContent=v}});w.AudioContext=function(){};w.matchMedia=()=>({matches:false,addEventListener(){},addListener(){}});w.HTMLCanvasElement.prototype.getContext=()=>new Proxy({},{get:(t,k)=>k==='canvas'?{}:(k==='measureText'?()=>({width:10}):()=>{}),set:()=>true});w.HTMLElement.prototype.scrollIntoView=()=>{};w.confirm=()=>false;w.alert=()=>{};w.URL.createObjectURL=()=>'blob:x';w.URL.revokeObjectURL=()=>{};w.open=()=>null;
 w.fetch=(u)=>Promise.resolve({ok:true,status:200,json:async()=>({PropertyTable:{Properties:[{CID:1,MolecularFormula:'<img data-xss src=x>',MolecularWeight:'1',IUPACName:'<img data-xss src=x>'}]},InformationList:{Information:[{CID:1,Title:'<img data-xss src=x>'}]},IdentifierList:{CID:[1]},name:'<img data-xss src=x>',title:'<img data-xss src=x>',extract:'<img data-xss src=x>'}),text:async()=>'<img data-xss src=x>',headers:{get:()=>'application/json'}});}});
const w=d.window,doc=w.document,sl=ms=>new Promise(r=>setTimeout(r,ms));
for(let i=0;i<240&&!w.CHEMOS_READY;i++)await sl(250);await sl(300);
const PAY=['<img data-xss src=x>','"><svg data-xss onload=1>','\' onmouseover=\'window.__x=1\' x=\'','</textarea><b data-xss>'];
const SKIP=/MENU|FAVORIT|CADERNO|ZERAR|LIMPAR|BAIXAR|COPIAR|PDF|LINK|MAIS|SAIR/i;
const bad=[];const scan=(n,pay,where)=>{const hit=doc.querySelector('[data-xss]');const ev=[...doc.querySelectorAll('#screen-content *, #modal *')].find(e=>e.hasAttribute&&(e.hasAttribute('onmouseover')));if(hit||ev){const e=hit||ev;bad.push(`M${n} ${where} payload ${JSON.stringify(pay).slice(0,30)} → <${e.tagName.toLowerCase()}> em ${(e.closest('[id]')||{}).id||'?'}`);}};
const only=process.argv[2]?process.argv[2].split(',').map(Number):[...Array(w.MODULE_MAX)].map((_,i)=>i+1);
for(const n of only){for(const pay of PAY){
  try{w.renderTool(n)}catch(e){continue} await sl(80);
  const root=doc.getElementById('screen-content');
  root.querySelectorAll('input:not([type=checkbox]):not([type=radio]):not([type=range]):not([type=file]),textarea').forEach(i=>{if(i.id==='cli-input')return;i.value=pay;i.dispatchEvent(new w.Event('input',{bubbles:true}));i.dispatchEvent(new w.Event('change',{bubbles:true}))});
  for(const b of [...root.querySelectorAll('button')].filter(b=>!SKIP.test(b.textContent)&&!b.disabled).slice(0,30)){if(!doc.body.contains(b))continue;try{b.click()}catch(e){}await sl(12)}
  await sl(450); scan(n,pay,'após botões');
  const t=doc.getElementById('toast');
}}
// linha de comando e busca
for(const pay of PAY){const cli=doc.getElementById('cli-input');cli.value=pay;cli.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Enter',bubbles:true}));await sl(500);scan(0,pay,'CLI');
  doc.dispatchEvent(new w.KeyboardEvent('keydown',{key:'k',ctrlKey:true,bubbles:true}));await sl(150);const q=doc.getElementById('pal-q');if(q){q.value=pay;q.dispatchEvent(new w.Event('input',{bubbles:true}));await sl(150);scan(0,pay,'paleta');}doc.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));}
console.log('POSSÍVEIS INJEÇÕES:',bad.length);process.exitCode=bad.length?1:0;[...new Set(bad)].slice(0,40).forEach(b=>console.log(' -',b));process.exit(process.exitCode||0)})();
