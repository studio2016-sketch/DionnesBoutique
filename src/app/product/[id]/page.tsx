import "./style.css";
export const dynamic="force-dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import { products } from "@/data/products";
import { getProductImage } from "@/data/product-images";
import CatalogPhoto from "@/components/CatalogPhoto";
import ProductPurchase from "@/components/ProductPurchase";
export function generateStaticParams(){return products.map(p=>({id:String(p.id)}));}
export async function generateMetadata({params}:{params:Promise<{id:string}>}){
 const {id}=await params;const p=products.find(x=>String(x.id)===id);
 if(!p)return {title:"Product not found",robots:{index:false,follow:false}};
 const title=`${p.brand} ${p.name} — ${p.variant}`;
 const description=`Explore ${p.brand} ${p.name}, ${p.variant}, at Dionne’s Boutique. ${p.category==="Open Box"?"Open-box cosmetic priced to reflect its disclosed packaging condition.":"Current availability is checked directly against WGOS inventory."}`;
 const canonical=`/product/${p.id}`;
 const photo=getProductImage(p.id);
 return {title,description,alternates:{canonical},openGraph:{title,description,url:canonical,type:"website",...(photo?{images:[{url:photo.url,alt:title}]}:{})},robots:{index:false,follow:false}};
}
export default async function ProductPage({params}:{params:Promise<{id:string}>}){const {id}=await params;const p=products.find(x=>String(x.id)===id);if(!p)notFound();const photo=getProductImage(p.id);
 const schema={
  "@context":"https://schema.org",
  "@type":"Product",
  name:`${p.brand} ${p.name} — ${p.variant}`,
  description:`Shop ${p.brand} ${p.name}, ${p.variant}. Live availability is managed through WGOS.`,
  brand:{"@type":"Brand",name:p.brand},
  sku:`DB-${String(p.id).padStart(3,"0")}`,
  url:`https://dionnesboutique.com/product/${p.id}`,
  ...(photo?{image:[new URL(photo.url,"https://dionnesboutique.com").href]}:{}),
  // No Offer, price, stock status, reviews, ratings or authenticity claims: checkout is disabled.
 };
 return <main className="detail-page"><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,"\\u003c")}}/><nav className="detail-nav"><Link href="/">← DIONNE’S BOUTIQUE</Link><Link href="/#shop">SHOP COLLECTIONS →</Link></nav><div className="detail-breadcrumb"><Link href="/">Home</Link> / <Link href="/#shop">{p.category}</Link> / {p.name}</div><div className="detail-grid"><div className="detail-image">{photo?<><CatalogPhoto url={photo.url} alt={`Reference image of ${p.brand} ${p.name} ${p.variant}`} className="detail-product-photo" priority/>{photo.source.startsWith("http")?<a className="photo-source" href={photo.source} target="_blank" rel="noopener noreferrer">View original product reference ↗</a>:<span className="photo-source">Photo provided for Dionne’s Boutique</span>}<span className="detail-image-disclaimer">{photo.source==="User-supplied product photograph"?"Boutique-supplied product photograph. See the listed condition for details.":"Manufacturer or retailer reference image; actual packaging may vary."}</span></>:<><span className="detail-decoration">✧</span><span className="detail-brand">{p.brand}</span><span className="detail-image-disclaimer">Photograph of actual inventory coming soon</span></>}</div><div className="detail-info"><span className="eyebrow">DIONNE’S CURATED EDIT</span><div className="detail-vendor">{p.brand}</div><h1>{p.name}</h1><p className="detail-variant">{p.variant}</p><ProductPurchase id={p.id} regularPrice={p.price} openBox={p.category==="Open Box"}/><div className="detail-condition"><strong>Condition:</strong> {p.condition}</div>{p.category==="Open Box"&&<div className="condition-warning"><strong>Open-box merchandise.</strong> This listing is priced to reflect its recorded condition. Review the product information before purchasing.</div>}<p className="detail-copy">Discover this curated beauty selection from Dionne’s Boutique. Available quantities are checked through WGOS; applicable shipping and sales tax are calculated during secure checkout.</p><p className="detail-small">Payments are securely processed through Dionne’s Boutique Stripe when checkout is available. Your shopping bag will display the current payment status.</p><div className="detail-promise">✦ Timeless Style. Elevated You. ✦</div></div></div><section className="detail-related"><span className="eyebrow">CONTINUE DISCOVERING</span><h2>More beautiful finds await.</h2><Link href="/#shop">EXPLORE ALL COLLECTIONS →</Link></section></main>}