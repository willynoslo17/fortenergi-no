/* Black Friday 2026 banner + pop-up. No tracking, no cookies; localStorage only remembers that the pop-up was closed. */
(function(){"use strict";
var B={"brand": "Fortenergi", "code": "BLACK20", "title": "Hold formen gjennom vinteren", "lead": "Black Friday hos Fortenergi: 20 % på utvalgt trening- og turutstyr.", "bg": "#111827", "accent": "#22c55e"};var now=Date.now(),start=Date.parse("2026-11-26T23:00:00Z"),end=Date.parse("2026-11-30T23:00:00Z");
var q=new URLSearchParams(location.search).get("bf");if(q==="live")now=start+1;if(q==="pre")now=start-3*864e5;
if(now>=end)return;var live=now>=start;
function el(t,s,h){var e=document.createElement(t);if(s)e.style.cssText=s;if(h!=null)e.innerHTML=h;return e;}
var bar=el("div","position:relative;z-index:9998;background:"+B.bg+";color:#fff;font:600 14px/1.4 Inter,Arial,sans-serif;text-align:center;padding:9px 40px");
bar.setAttribute("role","region");bar.setAttribute("aria-label","Black Friday");
var txt=el("span");bar.appendChild(txt);
function fmt(ms){var s=Math.max(0,Math.floor(ms/1e3)),d=Math.floor(s/86400),h=Math.floor(s%86400/3600),m=Math.floor(s%3600/60),x=s%60;return d+" d "+h+" t "+m+" min "+x+" s";}
function render(){var n=q?now:Date.now();if(n>=start||live){txt.innerHTML="<b>BLACK FRIDAY</b> · 20 % med koden <b style='background:"+B.accent+";color:#111;padding:1px 6px;border-radius:3px'>"+B.code+"</b> til og med 30. november · <a href='/black-friday' style='color:#fff'>Se tilbudene</a>";}
else{txt.innerHTML="<b>BLACK FRIDAY</b> starter om <span aria-live='off'>"+fmt(start-n)+"</span> · <a href='/black-friday' style='color:#fff'>Se kampanjevarene</a>";}}
render();if(!live&&!q)setInterval(render,1000);
document.body.insertBefore(bar,document.body.firstChild);
var FP={"armhevingsbrett-med-15-deler-tilbehor-strikker-stang-og-mage-19490095": [1079, 863], "treningsstrikksett-7-deler-baerbart-hjemmegym-15884606": [999, 799], "drikkeflaske-i-glass-for-kaldt-vann-bc8b7d56": [969, 775], "kokesett-for-camping-601776a1": [939, 751], "justerbart-kettlebellhandtak-til-manualsett-17ade0c3": [929, 743], "kettlebell-i-stopejern-13721086": [859, 687], "sportsflaske-med-sugeror-og-beskyttelsestrekk-16558587": [759, 607], "sammenleggbare-turstaver-c182bbed": [499, 399], "ultralette-turstaver-i-karbon-4b212768": [619, 495], "multifunksjonelt-magehjul-26013106": [609, 487], "justerbar-grepstrener-i-silikon-20-80-lb-16599097": [479, 383], "vanntett-liggeunderlag-og-piknikteppe-13782571": [479, 383]};/*fp*/
(function(){var m=location.pathname.match(/^\/p\/([^\/?#]+)/);if(!m||!live)return;var f=FP[m[1]];var pe=document.querySelector('.pp-price');if(!f||!pe)return;pe.innerHTML="<span style='color:#b91c1c'>"+f[1]+" kr</span> <small style='font-size:14px;font-weight:400;color:#555'>med koden "+B.code+" · Førpris (laveste pris siste 30 dager): <s>"+f[0]+" kr</s></small>";})();
if(/\/black-friday/.test(location.pathname))return;
var KEY="bf2026_popup_closed";try{if(localStorage.getItem(KEY))return;}catch(e){}
setTimeout(function(){
var ov=el("div","position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px");
var box=el("div","background:#fff;color:#111;max-width:420px;width:100%;border-radius:10px;padding:24px 22px;font:15px/1.5 Inter,Arial,sans-serif;position:relative;border-top:6px solid "+B.accent);
box.setAttribute("role","dialog");box.setAttribute("aria-modal","true");box.setAttribute("aria-labelledby","bfTitle");
var nl=document.getElementById("mlNewsletter"),nlOn=nl&&nl.dataset.state!=="disabled";
box.innerHTML="<button type='button' aria-label='Lukk' style='position:absolute;top:8px;right:10px;border:0;background:none;font-size:26px;cursor:pointer;line-height:1'>&times;</button>"+
"<p style='margin:0 0 4px;font-size:12px;letter-spacing:.08em;text-transform:uppercase'>"+B.brand+" · Black Friday</p><h2 id='bfTitle' style='margin:0 0 8px;font-size:22px'>"+B.title+"</h2><p style='margin:0 0 14px'>"+B.lead+"</p>"+
"<p style='margin:0 0 6px'>Bruk koden i kassen "+(live?"fram til 30. november":"fra 27. til og med 30. november")+":</p><p style='font:700 24px monospace;letter-spacing:.12em;background:#f3f3f3;padding:10px;text-align:center;margin:0 0 12px'>"+B.code+"</p>"+
"<p style='margin:0 0 14px;font-size:12px;color:#555'>Gjelder kampanjevarene på <a href='/black-friday'>/black-friday</a>. Kan ikke kombineres med andre varer i samme ordre.</p>"+
"<div style='display:flex;gap:8px;flex-wrap:wrap'><a href='/black-friday' style='background:#111;color:#fff;padding:10px 14px;text-decoration:none;border-radius:6px'>Se tilbudene</a>"+(nlOn?"<a href='#nyhetsbrev' data-nl style='padding:10px 14px;border:1px solid #111;color:#111;text-decoration:none;border-radius:6px'>Meld deg på nyhetsbrevet</a>":"")+"<button type='button' data-close style='padding:10px 14px;border:1px solid #bbb;background:#fff;border-radius:6px;cursor:pointer'>Nei takk</button></div>";
ov.appendChild(box);document.body.appendChild(ov);
function close(){ov.remove();try{localStorage.setItem(KEY,"1");}catch(e){}document.removeEventListener("keydown",esc);}
function esc(e){if(e.key==="Escape")close();}
document.addEventListener("keydown",esc);ov.addEventListener("click",function(e){if(e.target===ov)close();});
box.querySelectorAll("button,[data-nl]").forEach(function(b){b.addEventListener("click",close);});
box.querySelector("button").focus();},6000);
})();
