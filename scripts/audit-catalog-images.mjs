import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
const failed=[];
await page.goto("http://127.0.0.1:3000/",{waitUntil:"domcontentloaded"});
await page.waitForTimeout(1700);
await page.locator(".welcome-exit").click().catch(()=>{});
const cards=page.locator(".product-card");
const n=await cards.count();
for(let i=0;i<n;i++){
 const card=cards.nth(i);
 await card.scrollIntoViewIfNeeded();
 await page.waitForTimeout(100);
 const img=card.locator("img.product-photo");
 if(await img.count()) {
   await img.evaluate(im=>im.decode().catch(()=>{}));
   const ok=await img.evaluate(im=>im.complete&&im.naturalWidth>0);
   if(!ok)failed.push({position:i+1,title:(await card.locator("h3").innerText()),image:await img.getAttribute("src")});
 }else{
   failed.push({position:i+1,title:(await card.locator("h3").innerText()),image:null,reason:"No photograph loaded"});
 }
}
await mkdir("artifacts",{recursive:true});
await writeFile("artifacts/catalog-image-audit.json",JSON.stringify({total:n,displayed:n-failed.length,failed},null,2));
console.log(JSON.stringify({total:n,displayed:n-failed.length,failed},null,2));
await browser.close();
// Do not block deployment on an external retailer hotlink change: produce actionable report.
