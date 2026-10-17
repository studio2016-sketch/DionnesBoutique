// Temporary manufacturer/retailer reference photography, not photos of Dionne's actual stock.
// Verify image licensing/permission before launch; replace with owner-taken authentic unit photos.
// DO NOT use a fuzzy name match: the id must correspond to the exact size/formulation.
export const productImages: Record<number,{url:string;source:string}> = {
5:{url:"https://img.vivantiscdn.net/photos/-/p/_orig/CA/chanel-coco-mademoiselle-edp_14083563100923.jpg",source:"https://www.chanel.com/us/fragrance/p/116520/coco-mademoiselle-eau-de-parfum-spray/"},
3:{url:"https://escentual.com/cdn/shop/files/yves_saint_laurent_libre_intense_eau_de_parfum_spray_90ml_with_packaging.png?v=1729190692&width=1445",source:"https://escentual.com/products/yves-saint-laurent-libre-eau-de-parfum-intense-spray"},
26:{url:"https://www.tomfordbeauty.com/cdn/shop/files/tf_sku_T0CA01_2000x2000_0.png?v=1773906726&width=1200",source:"https://www.tomfordbeauty.com/products/tobacco-vanille-eau-de-parfum"}
};
export function getProductImage(id:number){return productImages[id]??null;}
