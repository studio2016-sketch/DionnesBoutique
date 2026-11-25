import {chromium} from "playwright";
import assert from "node:assert/strict";
const browser=await chromium.launch({headless:true});
for(const size of [{name:"iphone-compact",width:375,height:667},{name:"iphone-tall",width:390,height:844},{name:"desktop",width:1366,height:900}]){
 const page=await browser.newPage({viewport:{width:size.width,height:size.height}});
 try{
  // Hold the test inside the 2026 promotion window even after Cyber Monday.
  await page.addInitScript(()=>{
   const Original=Date,now=Original.parse("2026-11-26T12:00:00-06:00");
   window.Date=class extends Original{constructor(...args){super(...(args.length?args:[now]))}static now(){return now}};
  });
  await page.route("**/api/checkout",route=>route.fulfill({status:200,contentType:"application/json",body:JSON.stringify({
   stripeConnected:true,checkoutEnabled:true,webhookConfigured:true,fulfillmentConfigured:true,
   orderRecordingConfigured:true,shippingAndTaxConfigured:true,inventoryReady:true
  })}));
  await page.goto("http://127.0.0.1:3000/",{waitUntil:"domcontentloaded",timeout:30000});
  const dialog=page.locator(".bfcm-dialog");
  await dialog.waitFor({state:"visible",timeout:7000});
  assert.equal(await page.locator(".welcome-dialog").count(),1,"only one opening modal may exist");
  assert.match(await dialog.locator("h2").innerText(),/UP TO.*50% OFF/i);
  assert.equal(await dialog.getByText(/30% OFF/i).count(),1);
  assert.equal(await dialog.getByText(/40% OFF/i).count(),1);
  assert.equal(await dialog.getByText(/50% OFF/i).count(),2);
  assert.equal(await dialog.getByText(/Bonjour, Family/i).count(),0);
  const geometry=await dialog.evaluate(el=>({height:el.clientHeight,scrollHeight:el.scrollHeight,viewport:innerHeight}));
  assert.ok(geometry.height<=geometry.viewport,"sale modal extends beyond viewport");
  assert.ok(geometry.scrollHeight<=geometry.height+3,"sale modal needs internal scrolling");
  const button=dialog.getByRole("button",{name:/SHOP THE SALE/i});
  assert.equal(await button.isVisible(),true);
  const b=await button.boundingBox();
  assert.ok(b && b.y+b.height<=size.height,"shop button clipped on mobile");
  await page.locator(".bfcm-close").click();
  assert.equal(await page.locator(".welcome-dialog").count(),0);
  console.log(size.name+": single compact tiered popup fits viewport and closes.");
 }finally{await page.close()}
}
await browser.close();
