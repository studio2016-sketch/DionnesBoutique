import type { MetadataRoute } from "next";
import { products } from "@/data/products";
const base="https://dionnesboutique.com";
export default function sitemap(): MetadataRoute.Sitemap {
 // Pre-launch sitemap for QA; robots.txt and noindex still prevent discovery/indexing.
 return [{url:base,changeFrequency:"weekly",priority:1},...products.map(p=>({url:`${base}/product/${p.id}`,changeFrequency:"monthly" as const,priority:0.6}))];
}
