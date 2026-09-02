(()=>{
  const ready=()=>document.body.classList.add('lahza-ready');
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
  const progress=document.createElement('div');progress.className='lahza-top-progress';progress.setAttribute('aria-hidden','true');document.body.append(progress);
  const network=document.createElement('div');network.className='lahza-network';network.setAttribute('role','status');network.setAttribute('aria-live','polite');document.body.append(network);
  let networkTimer;
  function networkState(first=false){
    clearTimeout(networkTimer);
    const online=navigator.onLine;
    network.textContent=online?'رجع الاتصال بالإنترنت ✓':'ما في اتصال — بعض المزايا قد تتوقف';
    network.classList.toggle('online',online);network.classList.toggle('show',!first||!online);
    if(online&&!first)networkTimer=setTimeout(()=>network.classList.remove('show'),2600);
  }
  addEventListener('online',()=>networkState());addEventListener('offline',()=>networkState());networkState(true);
  const top=document.createElement('button');top.className='lahza-to-top';top.type='button';top.setAttribute('aria-label','العودة إلى أعلى الصفحة');top.textContent='↑';document.body.append(top);top.onclick=()=>scrollTo({top:0,behavior:'smooth'});
  function onScroll(){
    const max=document.documentElement.scrollHeight-innerHeight;
    progress.style.width=(max>0?Math.min(100,scrollY/max*100):0)+'%';
    top.classList.toggle('show',scrollY>650);
  }
  addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',onScroll,{passive:true});onScroll();
  document.addEventListener('click',e=>{
    const target=e.target.closest('button,.btn');if(!target||target.disabled||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const rect=target.getBoundingClientRect(),dot=document.createElement('span'),size=Math.max(rect.width,rect.height);
    dot.className='lahza-ripple';dot.style.cssText=`width:${size}px;height:${size}px;left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px`;
    const old=getComputedStyle(target).position;if(old==='static')target.style.position='relative';target.style.overflow='hidden';target.append(dot);setTimeout(()=>dot.remove(),600);
  });
  document.querySelectorAll('img:not([loading])').forEach((img,i)=>{if(i>0)img.loading='lazy';img.decoding='async'});
  document.querySelectorAll('a[target="_blank"]').forEach(a=>a.rel='noopener noreferrer');
})();
