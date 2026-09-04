const SUPABASE_URL = 'https://ltuyfewachzbazunuxmd.supabase.co';
const SUPABASE_KEY = 'sb_publishable_UL-3si425vxRnBAGcgtDJA_Xw5VB3yN';

export async function onRequestGet(context){
  try{
    const raw = String(context.params.slug || '').trim();
    const decoded = decodeURIComponent(raw);
    const codeMatch = decoded.match(/([a-f0-9]{8,12})$/i);

    if(!codeMatch){
      return redirectHome(context.request.url);
    }

    const code = codeMatch[1].toLowerCase();
    const url = new URL(`${SUPABASE_URL}/rest/v1/orders`);
    url.searchParams.set('select','gift_token,receiver,order_number,status');
    url.searchParams.set('gift_token',`like.${code}*`);
    url.searchParams.set('status','eq.paid');
    url.searchParams.set('order','created_at.desc');
    url.searchParams.set('limit','2');

    const response = await fetch(url.toString(),{
      headers:{
        apikey:SUPABASE_KEY,
        Authorization:`Bearer ${SUPABASE_KEY}`,
        Accept:'application/json'
      },
      cf:{cacheTtl:30,cacheEverything:true}
    });

    if(!response.ok){
      return redirectHome(context.request.url);
    }

    const rows = await response.json();
    if(!Array.isArray(rows) || rows.length !== 1 || !rows[0]?.gift_token){
      return redirectHome(context.request.url);
    }

    const destination = new URL('/gift.html',context.request.url);
    destination.searchParams.set('token',rows[0].gift_token);
    return Response.redirect(destination.toString(),302);
  }catch{
    return redirectHome(context.request.url);
  }
}

function redirectHome(requestUrl){
  return Response.redirect(new URL('/',requestUrl).toString(),302);
}
