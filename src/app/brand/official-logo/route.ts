import {NextResponse} from "next/server";

export const runtime="nodejs";
export const dynamic="force-dynamic";
const fallback="https://dionnesboutique.com/brand/official-gold-logo.svg";
export async function GET(){
 const secret=process.env.BOUTIQUE_ORDER_SYNC_SECRET;
 if(secret){
  try{
   const response=await fetch("https://wgos.app/api/retail/boutique-brand",{
    headers:{authorization:"Bearer "+secret},cache:"no-store",
    signal:AbortSignal.timeout(6500)
   });
   if(response.ok){
    const result=await response.json();
    const url=typeof result.logoUrl==="string"?new URL(result.logoUrl):null;
    if(url?.protocol==="https:"&&url.hostname.endsWith(".blob.vercel-storage.com")&&
     Number(result.width)>=700&&Number(result.height)>=400){
     const redirect=NextResponse.redirect(url,302);
     redirect.headers.set("Cache-Control","no-store, max-age=0");
     return redirect;
    }
   }
  }catch{ /* Preserve current logo when WGOS or image service is unavailable. */ }
 }
 const redirect=NextResponse.redirect(fallback,302);
 redirect.headers.set("Cache-Control","no-store, max-age=0");
 return redirect;
}
