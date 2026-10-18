import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
const browser = await chromium.launch({headless:true});
const sizes = [{name:'iphone-small',width:375,height:812},{name:'iphone-large',width:430,height:932},{name:'tablet',width:768,height:1024},{name:'laptop',width:1366,height:900}];
await mkdir('artifacts/screenshots',{recursive:true});
let failures=0;
for (const size of sizes){
 const page=await browser.newPage({viewport:{width:size.width,height:size.height},deviceScaleFactor:1});
 try{
  await page.goto('http://127.0.0.1:3000/',{waitUntil:'networkidle',timeout:30000});
  await page.screenshot({path:`artifacts/screenshots/${size.name}-homepage.png`,fullPage:false});
  const dimensions=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,viewport:window.innerWidth}));
  if(dimensions.scroll>dimensions.viewport+2){console.error(`${size.name}: horizontal overflow ${dimensions.scroll} > ${dimensions.viewport}`);failures++;}
  if(!(await page.locator('.site-header .brand').isVisible())){console.error(`${size.name}: brand missing`);failures++;}
  if(size.width<=650){
   const boxes=await Promise.all(['.mobile-menu','.brand','.bag-button'].map(sel=>page.locator('.site-header '+sel).boundingBox()));
   if(boxes.some(x=>!x)){console.error(`${size.name}: header element missing`);failures++;}
   else if(!(boxes[0].x+boxes[0].width<=boxes[1].x+2&&boxes[1].x+boxes[1].width<=boxes[2].x+2)){console.error(`${size.name}: mobile header controls overlap`);failures++;}
  }
  await page.evaluate(()=>sessionStorage.clear());
  await page.reload({waitUntil:'networkidle'});
  try{await page.locator('.welcome-dialog').waitFor({timeout:4500});}catch{console.error(`${size.name}: welcome did not appear`);failures++;}
  await page.screenshot({path:`artifacts/screenshots/${size.name}-welcome.png`,fullPage:false});
  await page.locator('.welcome-exit').click();
  if(await page.locator('.welcome-dialog').count()){console.error(`${size.name}: welcome did not close`);failures++;}
  console.log(`${size.name}: checked`);
 } finally {await page.close();}
}
await browser.close();
if(failures){console.error(`Responsive checks failed: ${failures}`);process.exit(1)}
console.log('All responsive checks passed.');
