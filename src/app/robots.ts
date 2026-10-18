import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
 // This store is still a non-transactional preview. Release indexing only after inventory,
 // authenticity, image licensing, legal pages and checkout have passed launch review.
 return {rules:[{userAgent:"*",disallow:"/"}],host:"https://dionnesboutique.com"};
}
