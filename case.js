(function(){
document.documentElement.classList.add('js');
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

/* rolling letters on any .roll heading */
document.querySelectorAll('.roll').forEach(el=>{
  const txt=el.textContent.trim();el.setAttribute('aria-label',txt);el.textContent='';
  let k=0;const words=txt.split(' ');
  words.forEach((word,wi)=>{const w=document.createElement('span');w.className='w';w.setAttribute('aria-hidden','true');
    [...word].forEach(ch=>{const c=document.createElement('span');c.className='c';c.textContent=ch;c.style.animationDelay=(.3+k++*.035)+'s';w.appendChild(c)});
    el.appendChild(w);if(wi<words.length-1)el.appendChild(document.createTextNode(' '));});
});

/* reveal on scroll */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('seen');io.unobserve(e.target)}}),{rootMargin:'0px 0px -10% 0px'});
document.querySelectorAll('.rv,.rv-img,.plan,.gantt,.matrix,.bars').forEach(el=>io.observe(el));
document.querySelectorAll('.matrix .chip').forEach((c,i)=>c.style.transitionDelay=(i*.03)+'s');
document.querySelectorAll('.gantt .bar').forEach((b,i)=>b.style.transitionDelay=(i*.15)+'s');

/* count-up numbers */
const cio=new IntersectionObserver(es=>es.forEach(e=>{
  if(!e.isIntersecting)return;cio.unobserve(e.target);
  const el=e.target,end=parseFloat(el.dataset.to),suf=el.dataset.suffix||'',pre=el.dataset.prefix||'';
  if(reduce){el.textContent=pre+end+suf;return}
  const t0=performance.now(),dur=1400;
  (function step(t){const p=Math.min(1,(t-t0)/dur),v=Math.round(end*(1-Math.pow(1-p,3)));el.textContent=pre+v+suf;if(p<1)requestAnimationFrame(step)})(t0);
}),{threshold:.6});
document.querySelectorAll('[data-to]').forEach(el=>cio.observe(el));

/* reading progress, tilted cover that settles as you scroll, header and next button */
const bar=document.querySelector('.readbar'),tilt=document.querySelector('.tilt'),head=document.querySelector('.site-head'),fab=document.querySelector('.fab'),hero=document.querySelector('.hero');
let tp=0,tt=0;
function onScroll(){
  const h=document.documentElement.scrollHeight-innerHeight;
  if(bar)bar.style.transform=`scaleX(${h>0?scrollY/h:0})`;
  if(tilt){const r=tilt.getBoundingClientRect();tt=Math.max(0,Math.min(1,1-(r.top-innerHeight*.18)/(innerHeight*.75)))}
  const past=hero?scrollY>hero.offsetHeight-80:scrollY>200;
  if(head)head.classList.toggle('solid',scrollY>40);
  if(fab)fab.classList.toggle('on',past&&scrollY<h-innerHeight*1.2);
}
(function tick(){tp+=(tt-tp)*(reduce?1:.1);if(tilt){const q=reduce?0:1-tp;
  tilt.style.transform=`rotateX(${q*48}deg) rotateZ(${q*-10}deg) translateY(${q*14}%) scale(${.86+.14*(1-q)})`}requestAnimationFrame(tick)})();
addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',onScroll);onScroll();

/* drag-to-scroll rails */
document.querySelectorAll('.rail').forEach(r=>{
  let down=false,sx=0,sl=0,moved=false;
  r.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse')return;down=true;moved=false;sx=e.clientX;sl=r.scrollLeft;r.classList.add('dragging')});
  addEventListener('pointermove',e=>{if(!down)return;const d=e.clientX-sx;if(Math.abs(d)>3)moved=true;r.scrollLeft=sl-d});
  addEventListener('pointerup',()=>{down=false;r.classList.remove('dragging')});
  r.addEventListener('click',e=>{if(moved){e.preventDefault();e.stopPropagation()}},true);
});

/* curtain on load and when moving between pages */
const curtain=document.querySelector('.curtain');
if(curtain){
  addEventListener('pageshow',()=>{curtain.className='curtain in'});
  document.querySelectorAll('a.pt').forEach(a=>a.addEventListener('click',e=>{
    if(reduce||e.metaKey||e.ctrlKey)return;e.preventDefault();
    const c=a.dataset.color;if(c)curtain.style.background=c;
    curtain.className='curtain out';setTimeout(()=>location.href=a.href,780)}));
}
document.querySelectorAll('[data-top]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();scrollTo({top:0,behavior:reduce?'auto':'smooth'})}));

/* cursor */
const cur=document.querySelector('.cursor');
if(cur){let x=innerWidth/2,y=innerHeight/2,tx=x,ty=y;
  addEventListener('pointermove',e=>{tx=e.clientX;ty=e.clientY;const t=e.target.closest?e.target:null;
    cur.classList.toggle('drag',!!(t&&t.closest('.rail')));
    cur.classList.toggle('link',!!(t&&t.closest('a,button'))&&!(t&&t.closest('.rail')))});
  (function loop(){x+=(tx-x)*.18;y+=(ty-y)*.18;cur.style.transform=`translate3d(${x}px,${y}px,0)`;requestAnimationFrame(loop)})();}
})();
