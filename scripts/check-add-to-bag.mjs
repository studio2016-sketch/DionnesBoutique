import {chromium} from "playwright";
import assert from "node:assert/strict";

const browser=await chromium.launch({headless:true});
const sizes=[{name:"iphone",width:390,height:844},{name:"desktop",width:1280,height:800}];
try{
 for(const size of sizes){
  const page=await browser.newPage({viewport:{width:size.width,height:size.height}});
  try{
   await page.route("**/api/catalog-status",route=>route.fulfill({status:200,contentType:"application/json",body:JSON.stringify({
    inventoryConnected:true,checkoutInventoryReady:false,products:[
     {id:17,priceCents:6500,available:1,approved:true,inStock:true},
     {id:18,priceCents:7500,available:1,approved:true,inStock:true}
    ]
   })}));
   await page.route("**/api/checkout",route=>route.fulfill({status:200,contentType:"application/json",body:JSON.stringify({
    stripeConnected:true,checkoutEnabled:false,webhookConfigured:true,
    orderRecordingConfigured:true,fulfillmentConfigured:false,
    shippingAndTaxConfigured:true,inventoryReady:false
   })}));
   await page.goto("http://127.0.0.1:3000/",{waitUntil:"domcontentloaded",timeout:30000});
   await page.locator(".welcome-exit").click({timeout:7000});
   const first=page.getByRole("button",{name:"Add Bad Boy to shopping bag",exact:true});
   await first.waitFor({state:"visible",timeout:8000});
   await page.waitForFunction(()=>{
    const b=document.querySelector('button[aria-label="Add Bad Boy to shopping bag"]');
    return b && !b.disabled;
   },null,{timeout:8000});
   await first.click();
   await page.locator(".drawer").waitFor({state:"visible",timeout:3000});
   const feedback=await page.locator(".bag-feedback").innerText();
   assert.match(feedback,/Bad Boy added to your bag/i);
   assert.equal(await page.locator(".bag-item").count(),1);
   assert.match(await page.locator(".bag-item").first().innerText(),/Bad Boy/);
   assert.equal((await page.locator(".bag-button span").innerText()).trim(),"1");
   await page.locator('.drawer-head button[aria-label="Close bag"]').click();
   await first.click();
   assert.match(await page.locator(".bag-feedback").innerText(),/already selected the available quantity/i);
   assert.equal(await page.locator(".bag-item").count(),1);
   await page.locator('.drawer-head button[aria-label="Close bag"]').click();
   await page.getByRole("button",{name:"Add Bad Boy Cobalt to shopping bag",exact:true}).click();
   assert.equal(await page.locator(".bag-item").count(),2);
   assert.equal((await page.locator(".bag-button span").innerText()).trim(),"2");
   assert.equal(await page.getByRole("button",{name:"SECURE CHECKOUT"}).isDisabled(),true);
   console.log(size.name+": tap opens bag, confirms item, enforces quantity limit and updates subtotal.");
  }finally{await page.close();}
 }
}finally{await browser.close();}
