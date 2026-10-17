import Link from "next/link";
import {cookies} from "next/headers";
import {products} from "@/data/products";
import {getProductImage} from "@/data/product-images";
export const metadata={title:"This Week’s Deals | Dionne’s Boutique",robots:{index:false,follow:false}};
export default async function DealsPage(){
 const subscribed=(await cookies()).get("dionnes_deals")?.value==="preview-subscriber";
 const picks=products.filter(p=>p.stock>0&&p.category!=="Open Box").sort((a,b)=>a.price-b.price).slice(0,12);
 return <main className="deals-page"><header className="deals-header"><Link href="/">← DIONNE’S BOUTIQUE</Link><span>TIMELESS STYLE. ELEVATED YOU.</span></header><section className="deals-hero"><span className="eyebrow">FOR THE BOUTIQUE FAMILY</span><h1>This Week’s <em>Beautiful Finds</em></h1><p>Curated fragrance and beauty selections at delightful prices.</p></section>{!subscribed?<div className="deals-gate"><h2>Get on the list.</h2><p>Become a subscriber to discover our weekly boutique selections. Enter your email on the homepage to join our boutique family.</p><Link href="/#subscribe">SUBSCRIBE FOR THE DEALS →</Link></div>:<><section className="deals-grid">{picks.map(p=>{const photo=getProductImage(p.id);return <Link className="deals-item" href={`/product/${p.id}`} key={p.id}><div className="deals-art">{photo?<img src={photo.url} alt={`Reference image for ${p.name}`}/>:<span>✧</span>}</div><small>{p.brand}</small><h2>{p.name}</h2><p>{p.variant}</p><strong>${p.price.toFixed(2)}</strong><div>VIEW THE PRODUCT →</div></Link>})}</section><p className="deals-caution">Preview only — this selection is not an active promotion. Final product images, pricing and stock require verification before checkout launches.</p></>}</main>
}