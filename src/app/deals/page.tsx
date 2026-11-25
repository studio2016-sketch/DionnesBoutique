import "./style.css";
import {saleActive} from "@/lib/black-friday";
export const dynamic="force-dynamic";
import Link from "next/link";
import {cookies} from "next/headers";
import {products} from "@/data/products";
import {getProductImage} from "@/data/product-images";
import CatalogPhoto from "@/components/CatalogPhoto";
import {fetchWgosInventory} from "@/lib/wgos-inventory";
export const metadata={title:"Weekly Beauty & Fragrance Picks",description:"Preview upcoming featured fragrances and beauty finds from Dionne’s Boutique. Subscribe for weekly boutique updates.",alternates:{canonical:"/deals"},robots:{index:false,follow:false}};
export default async function DealsPage(){
 const subscribed=(await cookies()).get("dionnes_deals")?.value==="preview-subscriber";
 let uploaded=new Map<number,string>();try{const inv=await fetchWgosInventory();uploaded=new Map(inv.products.filter(p=>Boolean(p.uploadedPhotoUrl)).map(p=>[p.id,p.uploadedPhotoUrl!]))}catch{}
 const picks=products.filter(p=>p.stock>0&&p.category!=="Open Box").sort((a,b)=>a.price-b.price).slice(0,12);
 return <main className="deals-page"><header className="deals-header"><Link href="/">← DIONNE’S BOUTIQUE</Link><span>TIMELESS STYLE. ELEVATED YOU.</span></header><section className="deals-hero"><span className="eyebrow">FOR THE BOUTIQUE FAMILY</span><h1>This Week’s <em>Beautiful Finds</em></h1><p>Curated fragrance and beauty selections at delightful prices.</p></section>{!subscribed?<div className="deals-gate"><h2>Get on the list.</h2><p>Become a subscriber to discover our weekly boutique selections. Enter your email on the homepage to join our boutique family.</p><Link href="/#subscribe">SUBSCRIBE FOR THE DEALS →</Link></div>:<><section className="deals-grid">{picks.map(p=>{const photo=uploaded.has(p.id)?{url:uploaded.get(p.id)!}:getProductImage(p.id);return <Link className="deals-item" href={`/product/${p.id}`} key={p.id}><div className="deals-art"><CatalogPhoto url={photo?.url} alt={`${p.brand} ${p.name} ${p.variant}`} className="deals-photo"/></div><small>{p.brand}</small><h2>{p.name}</h2><p>{p.variant}</p><strong>${p.price.toFixed(2)}</strong>{saleActive()&&<small>Sale savings calculated in your shopping bag</small>}<div>VIEW THE PRODUCT →</div></Link>})}</section><p className="deals-caution">Black Friday through Cyber Monday: UP TO 50% OFF. Orders with a merchandise subtotal before discounts under $75 receive 30% off; $75–$149.99 receive 40% off; $150 and above receive 50% off. The displayed product prices do not change: the discount is applied only in your shopping bag based on the combined purchase amount. The promotion ends November 30; shipping and applicable taxes are additional.</p></>}</main>
}