(()=>{
  const ready=()=>document.body.classList.add('lahza-ready');
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
  const progress=document.createElement('div');progress.className='lahza-top-progress';progress.setAttribute('aria-hidden','true');document.body.append(progress);
  const network=document.createElement('div');network.className='lahza-network';network.setAttribute('role','status');network.setAttribute('aria-live','polite');document.body.append(network);
  let networkTimer;
  function networkState(first=false){clearTimeout(networkTimer);const online=navigator.onLine;network.textContent=online?'رجع الاتصال بالإنترنت ✓':'ما في اتصال — بعض المزايا قد تتوقف';network.classList.toggle('online',online);network.classList.toggle('show',!first||!online);if(online&&!first)networkTimer=setTimeout(()=>network.classList.remove('show'),2600)}
  addEventListener('online',()=>networkState());addEventListener('offline',()=>networkState());networkState(true);
  const top=document.createElement('button');top.className='lahza-to-top';top.type='button';top.setAttribute('aria-label','العودة إلى أعلى الصفحة');top.textContent='↑';document.body.append(top);top.onclick=()=>scrollTo({top:0,behavior:'smooth'});
  function onScroll(){const max=document.documentElement.scrollHeight-innerHeight;progress.style.width=(max>0?Math.min(100,scrollY/max*100):0)+'%';top.classList.toggle('show',scrollY>650)}
  addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',onScroll,{passive:true});onScroll();
  document.addEventListener('click',e=>{const target=e.target.closest('button,.btn');if(!target||target.disabled||matchMedia('(prefers-reduced-motion: reduce)').matches)return;const rect=target.getBoundingClientRect(),dot=document.createElement('span'),size=Math.max(rect.width,rect.height);dot.className='lahza-ripple';dot.style.cssText=`width:${size}px;height:${size}px;left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px`;const old=getComputedStyle(target).position;if(old==='static')target.style.position='relative';target.style.overflow='hidden';target.append(dot);setTimeout(()=>dot.remove(),600)});
  document.querySelectorAll('img:not([loading])').forEach((img,i)=>{if(i>0)img.loading='lazy';img.decoding='async'});
  document.querySelectorAll('a[target="_blank"]').forEach(a=>a.rel='noopener noreferrer');

  function initAiGift(){
    const photoInput=document.getElementById('photoInput');
    if(!photoInput||document.getElementById('lahzaAiBox'))return;

    const occasionValue=String(document.getElementById('occasion')?.value||'surprise').toLowerCase();
    const occasionMap={
      love:{label:'حب',api:'love',scenes:[['holding_hands','ماسكين بعض','مسكة يد رومانسية'],['hug','حضن','حضن ناعم ودافئ'],['looking_at_each_other','يطالعون بعض','لقطة رومانسية هادئة'],['cozy_sitting','جلسة رومانسية','جلسة أنيقة مع بعض']]},
      birthday:{label:'عيد ميلاد',api:'birthday',scenes:[['cake','مع كيكة','كيكة عيد ميلاد'],['balloons','بالونات','جو احتفالي'],['opening_gift','فتح هدية','لقطة مفاجأة'],['blowing_candles','نفخ الشموع','لحظة أمنية']]},
      friend:{label:'صداقة',api:'friend',scenes:[['side_by_side','جنب بعض','وقفة صداقة طبيعية'],['friendly_hug','حضن صداقة','حضن لطيف'],['laughing','يضحكون','لقطة عفوية'],['coffee','قهوة مع بعض','جلسة أصحاب']]},
      graduation:{label:'تخرج',api:'graduation',scenes:[['cap_only','قبعة فقط','ستايل تخرج مرتب'],['cap_diploma','قبعة + شهادة','إنجاز رسمي'],['cap_cake','قبعة + كيكة','احتفال بالتخرج'],['toss_cap','رمي القبعة','لقطة حماسية']]},
      sorry:{label:'اعتذار',api:'sorry',scenes:[['flower_sorry','وردة واعتذار','جو اعتذار ناعم'],['sorry_card','كرت اعتذار','تفصيلة مؤثرة'],['calm_emotional','لقطة مؤثرة','هادية وصادقة'],['soft_apology','ناعم دافئ','ستايل بسيط']]},
      surprise:{label:'بدون مناسبة',api:'surprise',scenes:[['surprise_gift','هدية مفاجأة','هدية بدون سبب'],['flowers','ورد','لقطة ناعمة'],['elegant_portrait','بورتريه فاخر','صورة مرتبة'],['cozy_moment','لحظة عفوية','جو دافئ']]}
    };
    const cfg=occasionMap[occasionValue]||occasionMap.surprise;
    let sceneKey=cfg.scenes[0][0],lastBase64='',busy=false;

    const box=document.createElement('div');
    box.id='lahzaAiBox';box.className='lahza-ai-box';
    box.innerHTML=`<div class="lahza-ai-head"><div><b>✨ توليد صورة AI</b><small>اختر الشكل، ارفع صور الأشخاص، وبعد التوليد أضف الصورة مباشرة للهدية.</small></div><span class="lahza-ai-badge">${cfg.label}</span></div><div id="lahzaAiScenes" class="lahza-ai-scenes"></div><div class="lahza-ai-controls"><div><label>الصور المرجعية</label><input id="lahzaAiRefs" type="file" accept="image/*" multiple><div id="lahzaAiRefList" class="lahza-ai-refs"></div></div><div><label>ستايل الصورة</label><select id="lahzaAiStyle"><option value="واقعي دافئ">واقعي دافئ</option><option value="سينمائي فاخر">سينمائي فاخر</option><option value="ناعم حالم">ناعم حالم</option><option value="كرتوني لطيف">كرتوني لطيف</option></select></div></div><div class="lahza-ai-actions"><button id="lahzaAiGenerate" type="button" class="lahza-ai-btn primary">توليد الصورة</button><button id="lahzaAiUse" type="button" class="lahza-ai-btn secondary lahza-ai-hide">إضافة للهدية</button></div><div id="lahzaAiStatus" class="lahza-ai-status"></div><div id="lahzaAiResult" class="lahza-ai-result lahza-ai-hide"><img id="lahzaAiImg" alt="صورة مولدة بالذكاء الاصطناعي"></div>`;
    photoInput.parentNode.insertBefore(box,photoInput);

    const scenesEl=box.querySelector('#lahzaAiScenes'),refsInput=box.querySelector('#lahzaAiRefs'),refList=box.querySelector('#lahzaAiRefList'),generateBtn=box.querySelector('#lahzaAiGenerate'),useBtn=box.querySelector('#lahzaAiUse'),status=box.querySelector('#lahzaAiStatus'),result=box.querySelector('#lahzaAiResult'),img=box.querySelector('#lahzaAiImg'),style=box.querySelector('#lahzaAiStyle');

    function renderScenes(){scenesEl.innerHTML='';cfg.scenes.forEach(([key,title,desc])=>{const b=document.createElement('button');b.type='button';b.className='lahza-ai-scene'+(key===sceneKey?' active':'');b.innerHTML=`<b>${title}</b><small>${desc}</small>`;b.onclick=()=>{sceneKey=key;renderScenes()};scenesEl.appendChild(b)})}
    renderScenes();

    refsInput.addEventListener('change',()=>{refList.innerHTML='';[...refsInput.files].slice(0,4).forEach(file=>{const d=document.createElement('div');d.className='lahza-ai-ref';const p=document.createElement('img');p.src=URL.createObjectURL(file);d.appendChild(p);refList.appendChild(d)});if(refsInput.files.length>4)status.textContent='الحد الأقصى 4 صور مرجعية.'});

    function setLocal(msg,type=''){status.textContent=msg||'';status.style.color=type==='error'?'#ffabb8':type==='success'?'#9ce4ba':'';try{if(typeof setStatus==='function')setStatus(msg,type)}catch{}}
    function base64ToFile(base64){const raw=atob(base64),bytes=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)bytes[i]=raw.charCodeAt(i);return new File([bytes],`lahza-ai-${Date.now()}.png`,{type:'image/png'})}

    generateBtn.onclick=async()=>{
      if(busy)return;
      const files=[...refsInput.files].slice(0,4);
      if(!files.length){setLocal('ارفع صورة مرجعية أول.','error');return}
      if((occasionValue==='love')&&files.length<2){setLocal('للحب الأفضل ترفع صورتين عشان يطلع الشخصين مع بعض.','error');return}
      busy=true;generateBtn.disabled=true;useBtn.classList.add('lahza-ai-hide');result.classList.add('lahza-ai-hide');setLocal('قاعد نولد الصورة…');
      try{
        const fd=new FormData();fd.append('occasion',cfg.api);fd.append('sceneKey',sceneKey);fd.append('style',style.value);fd.append('imageCount',String(files.length));files.forEach((f,i)=>fd.append(`image${i+1}`,f));
        const res=await fetch('https://lamma-4t7.pages.dev/api/ai-gift',{method:'POST',body:fd});
        const data=await res.json().catch(()=>({}));if(!res.ok||data.error)throw new Error(data.error||'فشل توليد الصورة.');
        if(!data.image)throw new Error('ما رجعت صورة من خدمة AI.');
        lastBase64=data.image;img.src='data:image/png;base64,'+data.image;result.classList.remove('lahza-ai-hide');useBtn.classList.remove('lahza-ai-hide');setLocal('تم توليد الصورة ✓','success');
      }catch(err){setLocal(err?.message||'صار خطأ أثناء التوليد.','error')}finally{busy=false;generateBtn.disabled=false}
    };

    useBtn.onclick=()=>{
      if(!lastBase64)return;
      try{
        if(typeof photos==='undefined'||!Array.isArray(photos))throw new Error('تعذر إضافة الصورة للهدية.');
        if(typeof plan!=='undefined'&&photos.length>=plan.maxPhotos)throw new Error(`باقة ${plan.name} تسمح بحد أقصى ${plan.maxPhotos} صور.`);
        const file=base64ToFile(lastBase64);photos.push({file,url:URL.createObjectURL(file)});if(typeof renderPhotos==='function')renderPhotos();if(typeof updateSummary==='function')updateSummary();setLocal('تمت إضافة صورة AI للهدية ✓','success');
      }catch(err){setLocal(err?.message||'تعذر إضافة الصورة.','error')}
    };
  }

  setTimeout(initAiGift,0);
})();
