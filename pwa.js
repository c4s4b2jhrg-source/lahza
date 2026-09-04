// Allow embedded music players (especially YouTube) to receive a valid referrer.
// gift.html previously used no-referrer, which can make YouTube embeds refuse playback.
try{
  const ref=document.querySelector('meta[name="referrer"]');
  if(ref) ref.setAttribute('content','strict-origin-when-cross-origin');
}catch(e){}

if("serviceWorker" in navigator){
  window.addEventListener("load",()=>{
    navigator.serviceWorker.register("./sw.js").catch(()=>{});
  });
}
