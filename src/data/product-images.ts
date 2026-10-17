// Temporary manufacturer/retailer reference photography, not photos of Dionne's actual stock.
// Verify image licensing/permission before launch; replace with owner-taken authentic unit photos.
// DO NOT use a fuzzy name match: the id must correspond to the exact size/formulation.
export const productImages: Record<number,{url:string;source:string}> = {
 2:{url:"https://hrd-live.cdn.scayle.cloud/images/c6e7dd58ea477566e462e86bd8745f7e.jpg?bg=ffffff&brightness=1&height=1230&quality=75&width=922",source:"https://www.harrods.com/en-gb/p/carolina-herrera-good-girl-eau-de-parfum-80ml-000000000005956717"},
 20:{url:"https://cdn.salla.sa/OqdeyY/a7ad57f3-2543-4b50-9189-6a5da6cbd21e-1000x1000-hbW1IN6E8g32DXj06xf4ajau1ZMSAduVMMnNKO3n.png",source:"https://harrodsperfume.com/en/dior-homme-intense-edp-dior-harrodsperfume/p1804893983"},
 25:{url:"https://images.matas.dk/encode/8435415012669.jpg",source:"https://www.matas.dk/jean-paul-gaultier-lemale-eau-de-toilette-125-ml"},
5:{url:"https://img.vivantiscdn.net/photos/-/p/_orig/CA/chanel-coco-mademoiselle-edp_14083563100923.jpg",source:"https://www.chanel.com/us/fragrance/p/116520/coco-mademoiselle-eau-de-parfum-spray/"},
3:{url:"https://escentual.com/cdn/shop/files/yves_saint_laurent_libre_intense_eau_de_parfum_spray_90ml_with_packaging.png?v=1729190692&width=1445",source:"https://escentual.com/products/yves-saint-laurent-libre-eau-de-parfum-intense-spray"},
26:{url:"https://www.tomfordbeauty.com/cdn/shop/files/tf_sku_T0CA01_2000x2000_0.png?v=1773906726&width=1200",source:"https://www.tomfordbeauty.com/products/tobacco-vanille-eau-de-parfum"}
};
export function getProductImage(id:number){return productImages[id]??null;}
