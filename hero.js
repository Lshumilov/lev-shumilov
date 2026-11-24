(()=>{
 const hero=document.querySelector('.simple-hero'),art=hero?.querySelector('.hero-case');if(!hero||!art)return;
 const heading=hero.querySelector('h1'),copy=hero.firstElementChild;
 const lines=heading.innerHTML.split(/<br\s*\/?\s*>/i);
 heading.setAttribute('aria-label',lines.map(s=>s.replace(/<[^>]*>/g,'')).join(' '));
 heading.innerHTML=lines.map(line=>'<span class="hero-title-line" aria-hidden="true"><span>'+line+'</span></span>').join('');
 const mobile=matchMedia('(max-width:700px)'),systemReduce=matchMedia('(prefers-reduced-motion:reduce)');let scheduled=false,explicit=null;
 try{explicit=localStorage.getItem('lev-motion')}catch{}
 let enabled=explicit?explicit!=='reduced':!systemReduce.matches;
 const toggle=document.createElement('button');toggle.type='button';toggle.className='motion-control';
 function sync(){document.documentElement.dataset.motion=enabled?'full':'reduced';toggle.textContent=enabled?'Анимация: вкл':'Анимация: выкл';toggle.setAttribute('aria-pressed',String(enabled))}sync();
 document.querySelector('.footer').append(toggle);toggle.addEventListener('click',()=>{enabled=!enabled;explicit=enabled?'full':'reduced';try{localStorage.setItem('lev-motion',explicit)}catch{}sync();schedule()});
 systemReduce.addEventListener('change',()=>{if(!explicit){enabled=!systemReduce.matches;sync();schedule()}});
 const clamp=n=>Math.max(0,Math.min(1,n));
 function draw(){
  scheduled=false;if(!enabled){[art,copy,art.querySelector('img'),...heading.querySelectorAll('.hero-title-line>span')].forEach(n=>n.style.transform='none');hero.dataset.scrollProgress='0';return;}const r=hero.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;
  const p=clamp((scrollY-hero.offsetTop+90)/(hero.offsetHeight*.65)),small=mobile.matches;
  hero.dataset.scrollProgress=p.toFixed(3);
  art.style.transform=`perspective(1100px) translate3d(0,${-p*(small?22:85)}px,0) rotateY(${small?0:-7+p*11}deg) rotateZ(${small?0:-2+p*3}deg) scale(${small?1+p*.035:.94+p*.17})`;
  art.querySelector('.hero-case-image img').style.transform=`scale(${1+p*.075})`;
  copy.style.transform=`translate3d(0,${p*(small?10:35)}px,0)`;
  heading.querySelectorAll('.hero-title-line>span').forEach((line,i)=>line.style.transform=`translate3d(${p*(i===0?-1:1)*(small?8:22)}px,0,0)`);
 }
 const schedule=()=>{if(!scheduled){scheduled=true;requestAnimationFrame(draw)}};
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule,{passive:true});draw();
})();
