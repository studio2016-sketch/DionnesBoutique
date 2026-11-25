import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
const failed=[],passed=[],lowResolution=[],stretched=[],errors=[];
page.on("pageerror",err=>errors.push(err.message));
try {
 await page.goto("http://127.0.0.1:3000/",{waitUntil:"domcontentloaded"});
 await page.waitForTimeout(1600);
 await page.locator(".welcome-exit").click().catch(()=>{});
 const cards=page.locator(".product-card");
 const n=await cards.count();
 for(let i=0;i<n;i++){
  const card=cards.nth(i);
  await card.scrollIntoViewIfNeeded();
  const title=await card.locator("h3").innerText();
  const img=card.locator("img.product-photo");
  if(await img.count()){
   // Images are lazy loaded: allow time for the actual on-screen request before judging.
   const result=await img.evaluate(async el=>{
    if(!el.complete)await Promise.race([new Promise(r=>{el.addEventListener("load",r,{once:true});el.addEventListener("error",r,{once:true})}),new Promise(r=>setTimeout(r,6000))]);
    const rect=el.getBoundingClientRect();
    return {
     ok:el.complete&&el.naturalWidth>0,
     src:el.currentSrc||el.src,
     actualWidth:el.naturalWidth,actualHeight:el.naturalHeight,
     displayWidth:Math.round(rect.width),displayHeight:Math.round(rect.height),
     objectFit:getComputedStyle(el).objectFit,
     limited:el.naturalWidth>0&&(el.naturalWidth<480||el.naturalHeight<480)
    };
   });
   (result.ok?passed:failed).push({position:i+1,title,...result});
   if(result.limited)lowResolution.push({position:i+1,title,width:result.actualWidth,height:result.actualHeight});
   if(result.ok&&result.objectFit!=="contain")stretched.push({position:i+1,title,objectFit:result.objectFit});
  } else failed.push({position:i+1,title,reason:"No image, or component switched to fallback"});
 }
 const logo=await page.locator(".hero-official-logo").evaluate(el=>({
  naturalWidth:el.naturalWidth,naturalHeight:el.naturalHeight,
  displayedWidth:Math.round(el.getBoundingClientRect().width),
  source:el.currentSrc||el.src,
  isHiRes:el.naturalWidth>=800
 }));
 const report={total:n,displayed:passed.length,missing:failed.length,
  lowResolution:lowResolution.length,stretched:stretched.length,
  heroLogo:logo,passed,failed,lowResolutionItems:lowResolution,stretchedItems:stretched,pageErrors:errors};
 await mkdir("artifacts",{recursive:true});
 await writeFile("artifacts/catalog-image-audit.json",JSON.stringify(report,null,2));
 console.log(JSON.stringify({total:n,displayed:passed.length,missing:failed.length,
  lowResolution:lowResolution.length,lowResolutionItems:lowResolution,
  stretched,failed,heroLogo:logo,pageErrors:errors},null,2));
 if(n!==69)throw Error(`Expected 69 product cards, found ${n}`);
 if(errors.length)throw Error("Unexpected runtime errors occurred");
 if(stretched.length)throw Error("Product photos must retain their original aspect ratio.");
 // Photo availability and hero resolution are tracked until all exact owner-approved photos are uploaded.
 // Broken external images are reported but do not stop site deployment.
} finally {await browser.close()}
