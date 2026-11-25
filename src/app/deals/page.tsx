import "./style.css";
import {saleActive, merchandisePrice} from "@/lib/black-friday";
export const dynamic="force-dynamic";
import Link from "next/link";
import {cookies} from "next/headers";
import {products} from "@/data/products";
import {getProductImage} from "@/data/product-images";
import CatalogPhoto from "@/components/CatalogPhoto";
export const metadata={title:"Weekly Beauty & Fragrance Picks",description:"Preview upcoming featured fragrances and beauty finds from Dionne’s Boutique. Subscribe for weekly boutique updates.",alternates:{canonical:"/deals"},robots:{index:false,follow:false}};
export default async function DealsPage(){
 const subscribed=(await cookies()).get("dionnes_deals")?.value==="preview-subscriber";
 const picks=products.filter(p=>p.stock>0&&p.category!=="Open Box").sort((a,b)=>a.price-b.price).slice(0,12);
 return <main className="deals-page"><header className="deals-header"><Link href="/">← DIONNE’S BOUTIQUE</Link><span>TIMELESS STYLE. ELEVATED YOU.</span></header><section className="deals-hero"><span className="eyebrow">FOR THE BOUTIQUE FAMILY</span><h1>This Week’s <em>Beautiful Finds</em></h1><p>Curated fragrance and beauty selections at delightful prices.</p></section>{!subscribed?<div className="deals-gate"><h2>Get on the list.</h2><p>Become a subscriber to discover our weekly boutique selections. Enter your email on the homepage to join our boutique family.</p><Link href="/#subscribe">SUBSCRIBE FOR THE DEALS →</Link></div>:<><section className="deals-grid">{picks.map(p=>{const photo=getProductImage(p.id);return <Link className="deals-item" href={`/product/${p.id}`} key={p.id}><div className="deals-art"><CatalogPhoto url={photo?.url} alt={`${p.brand} ${p.name} ${p.variant}`} className="deals-photo"/></div><small>{p.brand}</small><h2>{p.name}</h2><p>{p.variant}</p><strong>{saleActive()&&<del style={{fontSize:"0.72em",color:"#806f59",marginRight:8}}>${p.price.toFixed(2)}</del>} ${merchandisePrice(p.price).toFixed(2)}</strong><div>VIEW THE PRODUCT →</div></Link>})}</section><p className="deals-caution">Preview catalog — Black Friday through Cyber Monday merchandise prices are 50% off through November 30, 2026. Original prices return December 1. Checkout is not yet enabled; inventory and availability require final verification.</p></>}</main>
}