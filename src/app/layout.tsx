import type { Metadata } from "next";
import "./globals.css";
const site="https://dionnesboutique.com";
export const metadata: Metadata = {
 metadataBase:new URL(site),
 title:{default:"Dionne’s Boutique | Designer Fragrances & Beauty Finds",template:"%s | Dionne’s Boutique"},
 description:"Discover Dionne’s Boutique’s curated preview of designer fragrances, foundations, concealers and beautiful beauty finds. Timeless Style. Elevated You.",
 applicationName:"Dionne’s Boutique",
 icons:{icon:"/brand/official-hero-highres.webp",apple:"/brand/official-hero-highres.webp"},
 alternates:{canonical:"/"},
 openGraph:{type:"website",locale:"en_US",url:site,siteName:"Dionne’s Boutique",title:"Dionne’s Boutique | Timeless Style. Elevated You.",description:"Explore curated designer fragrances and beautiful beauty essentials at Dionne’s Boutique."},
 twitter:{card:"summary",title:"Dionne’s Boutique",description:"Timeless Style. Elevated You. Designer fragrance and beauty finds."},
 robots:{index:false,follow:false,googleBot:{index:false,follow:false}},
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
 return <html lang="en"><body>{children}</body></html>;
}
