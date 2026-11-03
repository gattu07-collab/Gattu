/* Home hero: a night sky of moon phases on top; a soft blob follows the cursor and uncovers
   the design process underneath (grey at Listen, full colour at Launch). */
(function(){
const host=document.getElementById('moon');if(!host)return;
const PH=[
  {p:0,step:'Listen',desc:'Questions and a blank page'},
  {p:.25,step:'Sketch',desc:'Rough pencil ideas'},
  {p:.5,step:'Wireframe',desc:'Structure and flows'},
  {p:.75,step:'Design',desc:'Colour, type, real screens'},
  {p:1,step:'Launch',desc:'Shipped and trusted'}
];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const INK='#1d1d22',CORAL='#CB314D';
const c=document.createElement('canvas');c.setAttribute('aria-hidden','true');host.appendChild(c);
const x=c.getContext('2d');
const mk=()=>{const k=document.createElement('canvas');return[k,k.getContext('2d')]};
const [A,ax]=mk(),[B,bx]=mk(),[M,mx]=mk(),[V,vx]=mk();
let W=0,H=0,dpr=1,G=[],mob=false,amt=0,ptr={x:-999,y:-999,on:false},pos={x:0,y:0},prev={x:0,y:0},t0=performance.now();
const trail=[];
const base='';
const MOONS=[1,2,3,4,5].map(n=>{const im=new Image();im.onload=()=>{if(W)drawTop(layout())};im.src=base+'moon-'+n+'.webp';return im});

function rng(seed){let s=seed%2147483647||1;return()=>(s=(s*16807)%2147483647)/2147483647}
const TEX=document.createElement('canvas');TEX.width=TEX.height=512;
(function(){const t=TEX.getContext('2d'),r=rng(11);
  const g=t.createRadialGradient(200,190,20,256,256,256);g.addColorStop(0,'#F4EEE2');g.addColorStop(.7,'#D9D2C4');g.addColorStop(1,'#B9B1A2');
  t.fillStyle=g;t.beginPath();t.arc(256,256,256,0,7);t.fill();t.save();t.beginPath();t.arc(256,256,256,0,7);t.clip();
  [[180,170,110],[320,250,90],[230,340,70],[350,140,55]].forEach(([a,b,rr])=>{const m=t.createRadialGradient(a,b,0,a,b,rr);m.addColorStop(0,'rgba(120,112,100,.38)');m.addColorStop(1,'rgba(120,112,100,0)');t.fillStyle=m;t.fillRect(0,0,512,512)});
  for(let i=0;i<70;i++){const a=r()*512,b=r()*512,rr=3+Math.pow(r(),3)*34;
    t.fillStyle='rgba(110,102,90,.28)';t.beginPath();t.arc(a,b,rr,0,7);t.fill();
    t.strokeStyle='rgba(255,250,240,.35)';t.lineWidth=Math.max(1,rr*.12);t.beginPath();t.arc(a-rr*.08,b-rr*.08,rr,Math.PI*.9,Math.PI*1.9);t.stroke()}
  t.restore()})();
function litPath(ctx,cx,cy,R,ph){ctx.beginPath();
  if(ph<=.001)return false;
  if(ph>=.999){ctx.arc(cx,cy,R,0,Math.PI*2);return true}
  const rx=Math.abs(Math.cos(ph*Math.PI))*R;
  ctx.moveTo(cx,cy-R);ctx.arc(cx,cy,R,-Math.PI/2,Math.PI/2,false);
  ctx.ellipse(cx,cy,Math.max(rx,.01),R,0,Math.PI/2,-Math.PI/2,ph<.5);ctx.closePath();return true}
function rrect(ctx,x0,y0,w,h,r){ctx.beginPath();ctx.roundRect?ctx.roundRect(x0,y0,w,h,r):ctx.rect(x0,y0,w,h)}
function headline(ctx,lines,fs,x0,y0,col,acc,italicWord){
  ctx.textBaseline='alphabetic';let y=y0;
  lines.forEach(line=>{let xx=x0;line.split(/(\s+)/).forEach(w=>{const it=italicWord&&w.replace(/[.,]/g,'')===italicWord;
    const word=it?w.replace(/[.,]/g,''):w;ctx.font=`${it?'italic ':''}400 ${fs}px "DM Serif Display", Georgia, serif`;ctx.fillStyle=it?acc:col;ctx.fillText(word,xx,y);xx+=ctx.measureText(word).width;
    if(it&&w!==word){ctx.font=`400 ${fs}px "DM Serif Display", Georgia, serif`;ctx.fillStyle=col;const p=w.slice(word.length);ctx.fillText(p,xx,y);xx+=ctx.measureText(p).width}});
    y+=fs*1.02});}
function spaced(ctx,text,x0,y0,sp){if('letterSpacing' in ctx){ctx.save();ctx.letterSpacing=sp+'px';ctx.fillText(text,x0,y0);ctx.restore()}else ctx.fillText(text,x0,y0)}

function layout(){mob=W<=760;
  const padX=Math.max(20,Math.min(W*.04,80));
  const mx0=mob?W*.11:Math.max(W*.1,110),span=W-2*mx0;
  const R=mob?Math.min(span/4*.38,H*.05):Math.min(span/4*.3,H*.11);
  const base=mob?H*.64:H*.68,lift=mob?H*.07:H*.15;
  G=PH.map((_,i)=>({x:mx0+i*span/4,y:base-Math.sin(Math.PI*i/4)*lift,R}));
  return{padX,fs:mob?Math.max(34,Math.min(W*.1,46)):Math.max(40,Math.min(W*.048,78)),top:(mob?128:Math.max(170,H*.22))};
}

/* top: night sky with the five phases */
function drawTop(L){const t=ax;t.setTransform(dpr,0,0,dpr,0,0);
  const g=t.createLinearGradient(0,0,0,H);g.addColorStop(0,'#050608');g.addColorStop(1,'#0C1018');t.fillStyle=g;t.fillRect(0,0,W,H);
  const r=rng(7);for(let i=0,n=Math.round(W*H/4200);i<n;i++){t.fillStyle=`rgba(237,232,223,${r()*.5+.08})`;t.beginPath();t.arc(r()*W,r()*H,r()<.05?1.3:.65,0,7);t.fill()}
  t.font='700 12px Outfit, system-ui, sans-serif';t.fillStyle='#7F879B';if(!mob)spaced(t,'PRODUCT DESIGNER',L.padX,L.top-L.fs*.95,2.4);
  headline(t,['Every moon','has its phases.'],L.fs,L.padX,L.top,'#EDE8DF','#F2D9A6','phases');
  // the photographed moons; 'screen' lets the black of the photo melt into the sky
  PH.forEach((ph,i)=>{const {x:cx,y:cy,R}=G[i];
    const h=t.createRadialGradient(cx,cy,R*.9,cx,cy,R*2.4);h.addColorStop(0,`rgba(242,217,166,${.02+(i/4)*.08})`);h.addColorStop(1,'rgba(242,217,166,0)');t.fillStyle=h;t.beginPath();t.arc(cx,cy,R*2.6,0,7);t.fill();
    t.fillStyle='#06080C';t.beginPath();t.arc(cx,cy,R*.99,0,7);t.fill();
    const im=MOONS[i];if(im&&im.complete&&im.naturalWidth){const s=R*2.247;t.save();t.globalCompositeOperation='screen';t.drawImage(im,cx-s/2,cy-s/2,s,s);t.restore()}});
}

/* underneath: grey to colour */
const ICON={
  listen(t,cx,cy,s){rrect(t,cx-s*.55,cy-s*.42,s*.85,s*.55,s*.14);t.stroke();t.beginPath();t.moveTo(cx-s*.32,cy+s*.13);t.lineTo(cx-s*.4,cy+s*.32);t.lineTo(cx-s*.14,cy+s*.13);t.stroke();
    rrect(t,cx-s*.05,cy-s*.05,s*.6,s*.42,s*.12);t.stroke();[0,1,2].forEach(k=>{t.beginPath();t.arc(cx-s*.32+k*s*.17,cy-s*.15,s*.03,0,7);t.fill()})},
  sketch(t,cx,cy,s){t.save();t.translate(cx,cy);t.rotate(-Math.PI/4);rrect(t,-s*.5,-s*.11,s*.75,s*.22,2);t.stroke();t.beginPath();t.moveTo(s*.25,-s*.11);t.lineTo(s*.5,0);t.lineTo(s*.25,s*.11);t.stroke();
    t.beginPath();t.moveTo(-s*.32,-s*.11);t.lineTo(-s*.32,s*.11);t.stroke();t.restore();t.beginPath();t.moveTo(cx-s*.5,cy+s*.45);t.bezierCurveTo(cx-s*.25,cy+s*.3,cx,cy+s*.6,cx+s*.3,cy+s*.42);t.stroke()},
  wire(t,cx,cy,s){t.strokeRect(cx-s*.5,cy-s*.4,s,s*.8);t.beginPath();t.moveTo(cx-s*.5,cy-s*.2);t.lineTo(cx+s*.5,cy-s*.2);t.moveTo(cx-s*.1,cy-s*.2);t.lineTo(cx-s*.1,cy+s*.4);t.stroke();
    t.beginPath();t.moveTo(cx,cy-s*.05);t.lineTo(cx+s*.38,cy-s*.05);t.moveTo(cx,cy+s*.1);t.lineTo(cx+s*.3,cy+s*.1);t.stroke()},
  design(t,cx,cy,s){t.beginPath();t.arc(cx,cy,s*.5,0,7);t.stroke();
    [[-.2,-.2],[.18,-.24],[.3,.08]].forEach(([dx,dy])=>{t.beginPath();t.arc(cx+dx*s,cy+dy*s,s*.08,0,7);t.fill()});
    t.beginPath();t.arc(cx-s*.1,cy+s*.24,s*.12,0,7);t.stroke()},
  launch(t,cx,cy,s){t.save();t.translate(cx,cy);t.rotate(Math.PI/4);t.beginPath();t.moveTo(0,-s*.55);t.bezierCurveTo(s*.25,-s*.3,s*.22,s*.15,s*.14,s*.3);t.lineTo(-s*.14,s*.3);t.bezierCurveTo(-s*.22,s*.15,-s*.25,-s*.3,0,-s*.55);t.stroke();
    t.beginPath();t.arc(0,-s*.12,s*.09,0,7);t.stroke();t.beginPath();t.moveTo(-s*.18,s*.12);t.lineTo(-s*.32,s*.36);t.lineTo(-s*.14,s*.3);t.moveTo(s*.18,s*.12);t.lineTo(s*.32,s*.36);t.lineTo(s*.14,s*.3);t.stroke();
    t.beginPath();t.moveTo(-s*.06,s*.36);t.lineTo(0,s*.55);t.lineTo(s*.06,s*.36);t.stroke();t.restore()}
};
const ICONS=['listen','sketch','wire','design','launch'];
function drawHid(L){const t=bx;t.setTransform(dpr,0,0,dpr,0,0);
  t.fillStyle='#000000';t.fillRect(0,0,W,H);
  t.font='700 12px Outfit, sans-serif';t.fillStyle='rgba(237,232,223,.55)';if(!mob)spaced(t,'FROM GREY TO COLOUR',L.padX,L.top-L.fs*.95,2.4);
  headline(t,['So does','every design.'],L.fs,L.padX,L.top,'#EDE8DF',CORAL,'design');
  const cols=['#D8D4CD','#B9C2BF','#86B3AA','#1F9C8C',null];
  t.lineWidth=Math.max(2,G[0].R*.06);t.lineCap='round';const lg=t.createLinearGradient(G[0].x,0,G[4].x,0);lg.addColorStop(0,'#D8D4CD');lg.addColorStop(.75,'#1F9C8C');lg.addColorStop(1,CORAL);
  t.strokeStyle=lg;t.beginPath();G.forEach((g,i)=>i?t.lineTo(g.x,g.y):t.moveTo(g.x,g.y));t.stroke();
  PH.forEach((ph,i)=>{const {x:cx,y:cy,R}=G[i];
    t.save();t.shadowColor='rgba(255,255,255,.06)';t.shadowBlur=R*.4;t.shadowOffsetY=R*.08;t.beginPath();t.arc(cx,cy,R,0,7);
    if(cols[i])t.fillStyle=cols[i];else{const g=t.createLinearGradient(cx-R,cy-R,cx+R,cy+R);g.addColorStop(0,'#F2BE62');g.addColorStop(1,CORAL);t.fillStyle=g}t.fill();t.restore();
    if(i===4){[[-1.25,-.7],[1.2,-.6],[1.05,.9],[-1.15,.75]].forEach(([dx,dy],k)=>{t.fillStyle=['#F2BE62','#1F9C8C',CORAL,'#2E4466'][k];t.beginPath();t.arc(cx+dx*R,cy+dy*R,R*.07,0,7);t.fill()})}
    const ic=i<2?'rgba(29,29,34,.7)':'#fff';t.strokeStyle=ic;t.fillStyle=ic;t.lineWidth=Math.max(1.6,R*.045);t.lineCap='round';t.lineJoin='round';ICON[ICONS[i]](t,cx,cy,R*.62);
    t.textAlign='center';t.fillStyle='#EDE8DF';t.font=`400 ${mob?16:Math.max(22,Math.min(W*.02,30))}px "DM Serif Display", serif`;t.fillText(ph.step,cx,mob?(i%2?cy-R-14:cy+R+26):cy+R+62);
    if(!mob){t.font='500 13px Outfit, sans-serif';t.fillStyle='rgba(237,232,223,.62)';t.fillText(ph.desc,cx,cy+R+84);
      t.font='700 11px Outfit, sans-serif';t.fillStyle=CORAL;spaced(t,'0'+(i+1),cx,cy+R+30,2)}
    t.textAlign='left'});
}

/* reveal */
function blob(cx,cy,r,t){const n=9;
  for(let i=0;i<n;i++){const a=i/n*Math.PI*2+t*.6,wob=1+.22*Math.sin(t*1.7+i*1.9)+.12*Math.sin(t*2.9+i*3.1);
    const px=cx+Math.cos(a)*r*.45*wob,py=cy+Math.sin(a)*r*.45*wob,rr=r*(.62+.18*Math.sin(t*2.2+i));
    const g=mx.createRadialGradient(px,py,0,px,py,rr);g.addColorStop(0,'rgba(0,0,0,1)');g.addColorStop(.7,'rgba(0,0,0,.9)');g.addColorStop(1,'rgba(0,0,0,0)');mx.fillStyle=g;mx.beginPath();mx.arc(px,py,rr,0,7);mx.fill()}
  const g=mx.createRadialGradient(cx,cy,0,cx,cy,r*.9);g.addColorStop(0,'rgba(0,0,0,1)');g.addColorStop(1,'rgba(0,0,0,0)');mx.fillStyle=g;mx.beginPath();mx.arc(cx,cy,r*.9,0,7);mx.fill()}
function active(){return document.body.classList.contains('at-intro')}

/* thin grid lines around the cursor (like the reference): they bulge a little near the pointer,
   raspberry close in, fading to grey and then nothing further out */
const gpos={x:0,y:0};
function gridLines(t){
  const cell=mob?52:76,R=Math.max(cell*3.2,Math.min(W,H)*(mob?.38:.36));
  gpos.x+=(pos.x-gpos.x)*.12;gpos.y+=(pos.y-gpos.y)*.12;
  const cx=gpos.x,cy=gpos.y,sig=R*.45,bulge=reduce?0:.16;
  const warp=(px,py)=>{const dx=px-cx,dy=py-cy,f=bulge*Math.exp(-(dx*dx+dy*dy)/(sig*sig));return[px+dx*f,py+dy*f]};
  const fade=(px,py)=>{const d=Math.hypot(px-cx,py-cy)/R;return d>=1?0:Math.pow(1-d,1.6)*amt};
  const col=(a)=>`rgba(242,217,166,${a})`; // the moonlight gold of 'phases'
  x.lineWidth=1;const step=8;
  const seg=(x0,y0,x1,y1)=>{const mxp=(x0+x1)/2,myp=(y0+y1)/2,a=fade(mxp,myp);if(a<.02)return;
    const [ax,ay]=warp(x0,y0),[bx2,by2]=warp(x1,y1);x.strokeStyle=col(Math.min(1,a*.75));x.beginPath();x.moveTo(ax,ay);x.lineTo(bx2,by2);x.stroke()};
  const gx0=Math.floor((cx-R)/cell)*cell,gx1=cx+R,gy0=Math.floor((cy-R)/cell)*cell,gy1=cy+R;
  for(let gx=gx0;gx<=gx1;gx+=cell)for(let y=cy-R;y<cy+R;y+=step)seg(gx,y,gx,y+step);
  for(let gy=gy0;gy<=gy1;gy+=cell)for(let xx=cx-R;xx<cx+R;xx+=step)seg(xx,gy,xx+step,gy);
  // small nodes where lines cross, close to the pointer
  for(let gx=gx0;gx<=gx1;gx+=cell)for(let gy=gy0;gy<=gy1;gy+=cell){const d=Math.hypot(gx-cx,gy-cy)/R;if(d>.45)continue;
    const [px,py]=warp(gx,gy);x.fillStyle=`rgba(242,217,166,${(1-d/.45)*amt})`;x.beginPath();x.arc(px,py,1.8,0,7);x.fill()}
}
function frame(now){requestAnimationFrame(frame);if(!active()||!W)return;
  const t=Math.max(0,now-t0)/1000;
  // the reveal only appears where the visitor points; it never moves on its own
  amt+=((ptr.on?1:0)-amt)*(reduce?1:.08);
  pos.x+=(ptr.x-pos.x)*(reduce?1:.1);pos.y+=(ptr.y-pos.y)*(reduce?1:.1);
  const sp=Math.min(1,Math.hypot(pos.x-prev.x,pos.y-prev.y)/40);prev={x:pos.x,y:pos.y};
  const rad=Math.max(G[0].R*2.1,Math.min(W,H)*(mob?.2:.16))*(1+sp*.25)*(.35+.65*amt);
  trail.unshift({x:pos.x,y:pos.y,r:rad});if(trail.length>(reduce?1:30))trail.pop();
  mx.clearRect(0,0,W,H);
  if(amt<.01){x.clearRect(0,0,W,H);x.drawImage(A,0,0,W,H);return}
  for(let i=trail.length-1;i>=2;i-=2){const q=trail[i],a=Math.pow(1-i/trail.length,1.6)*.85*amt;
    const g=mx.createRadialGradient(q.x,q.y,0,q.x,q.y,q.r*.85);g.addColorStop(0,`rgba(0,0,0,${a})`);g.addColorStop(.6,`rgba(0,0,0,${a*.7})`);g.addColorStop(1,'rgba(0,0,0,0)');
    mx.fillStyle=g;mx.beginPath();mx.arc(q.x,q.y,q.r*.85,0,7);mx.fill()}
  mx.globalAlpha=amt;
  blob(pos.x,pos.y,rad,t);mx.globalAlpha=1;
  vx.globalCompositeOperation='source-over';vx.clearRect(0,0,W,H);vx.drawImage(B,0,0,W,H);vx.globalCompositeOperation='destination-in';vx.drawImage(M,0,0,W,H);
  x.clearRect(0,0,W,H);x.drawImage(A,0,0,W,H);x.drawImage(V,0,0,W,H);gridLines(t)}

function size(){dpr=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;
  [c,A,B,M,V].forEach(k=>{k.width=W*dpr;k.height=H*dpr});[x,mx,vx].forEach(k=>k.setTransform(dpr,0,0,dpr,0,0));
  const L=layout();drawTop(L);drawHid(L)}
function point(e,on){if(amt<.02){pos.x=prev.x=gpos.x=e.clientX;pos.y=prev.y=gpos.y=e.clientY;trail.length=0}ptr={x:e.clientX,y:e.clientY,on}}
addEventListener('pointermove',e=>{if(e.pointerType==='mouse')point(e,true);else if(e.buttons)point(e,true)},{passive:true});
addEventListener('pointerdown',e=>point(e,true),{passive:true});
addEventListener('pointerup',e=>{if(e.pointerType!=='mouse')ptr.on=false},{passive:true});
addEventListener('pointercancel',()=>{ptr.on=false},{passive:true});
document.addEventListener('mouseleave',()=>{ptr.on=false});
addEventListener('blur',()=>{ptr.on=false});
size();pos={x:G[0].x,y:G[0].y};prev={...pos};addEventListener('resize',size);
Promise.race([Promise.all(['400 40px "DM Serif Display"','italic 400 40px "DM Serif Display"','500 13px Outfit','700 12px Outfit'].map(f=>document.fonts.load(f))),new Promise(r=>setTimeout(r,2500))]).then(size);
requestAnimationFrame(frame);
})();
