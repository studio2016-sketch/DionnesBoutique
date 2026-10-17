// Derived from Dionnes_Boutique_Official_Inventory_Price_Profit.xlsx — Master Inventory.
// Preview only: not authoritative stock, not connected to order processing.
// Every product, condition and authenticity must be approved before real checkout.
export type Product = {id:number; category:string; brand:string; name:string; variant:string; stock:number; price:number; condition:string};
export const products: Product[] = [
  {
    "id": 1,
    "category": "Fragrance",
    "brand": "Lancôme",
    "name": "La Vie Est Belle L'Éclat",
    "variant": "EDT 100 mL",
    "stock": 1,
    "price": 55,
    "condition": "New — verify before launch"
  },
  {
    "id": 2,
    "category": "Fragrance",
    "brand": "Carolina Herrera",
    "name": "Good Girl",
    "variant": "EDP 80 mL",
    "stock": 1,
    "price": 75,
    "condition": "New — verify before launch"
  },
  {
    "id": 3,
    "category": "Fragrance",
    "brand": "Yves Saint Laurent",
    "name": "Libre",
    "variant": "EDP Intense 90 mL",
    "stock": 2,
    "price": 75,
    "condition": "New — verify before launch"
  },
  {
    "id": 4,
    "category": "Fragrance",
    "brand": "Yves Saint Laurent",
    "name": "Black Opium",
    "variant": "EDP 90 mL",
    "stock": 2,
    "price": 75,
    "condition": "New — verify before launch"
  },
  {
    "id": 5,
    "category": "Fragrance",
    "brand": "Chanel",
    "name": "Coco Mademoiselle",
    "variant": "EDP 100 mL",
    "stock": 4,
    "price": 75,
    "condition": "New — verify before launch"
  },
  {
    "id": 6,
    "category": "Fragrance",
    "brand": "Givenchy",
    "name": "L'Interdit",
    "variant": "EDP 80 mL",
    "stock": 1,
    "price": 75,
    "condition": "New — verify before launch"
  },
  {
    "id": 7,
    "category": "Fragrance",
    "brand": "Prada",
    "name": "Paradoxe",
    "variant": "EDP 90 mL",
    "stock": 1,
    "price": 75,
    "condition": "New — verify before launch"
  },
  {
    "id": 8,
    "category": "Fragrance",
    "brand": "Prada",
    "name": "Paradoxe Intense",
    "variant": "EDP 90 mL",
    "stock": 2,
    "price": 75,
    "condition": "New — verify before launch"
  },
  {
    "id": 9,
    "category": "Fragrance",
    "brand": "Yves Saint Laurent",
    "name": "Mon Paris",
    "variant": "EDP 90 mL",
    "stock": 3,
    "price": 75,
    "condition": "New — verify before launch"
  },
  {
    "id": 10,
    "category": "Fragrance",
    "brand": "Dolce & Gabbana",
    "name": "The Only One",
    "variant": "EDP 100 mL",
    "stock": 1,
    "price": 75,
    "condition": "New — verify before launch"
  },
  {
    "id": 11,
    "category": "Fragrance",
    "brand": "Dolce & Gabbana",
    "name": "Light Blue",
    "variant": "EDT 100 mL",
    "stock": 1,
    "price": 65,
    "condition": "New — verify before launch"
  },
  {
    "id": 12,
    "category": "Fragrance",
    "brand": "Miss Dior",
    "name": "Blooming Bouquet",
    "variant": "EDT 100 mL",
    "stock": 1,
    "price": 65,
    "condition": "New — verify before launch"
  },
  {
    "id": 13,
    "category": "Fragrance",
    "brand": "Miss Dior",
    "name": "Essence",
    "variant": "EDP 80 mL",
    "stock": 1,
    "price": 75,
    "condition": "New — verify before launch"
  },
  {
    "id": 14,
    "category": "Fragrance",
    "brand": "Chanel",
    "name": "N°5",
    "variant": "EDP 100 mL",
    "stock": 1,
    "price": 75,
    "condition": "New — verify before launch"
  },
  {
    "id": 15,
    "category": "Fragrance",
    "brand": "Carolina Herrera",
    "name": "La Bomba",
    "variant": "EDP 80 mL",
    "stock": 1,
    "price": 75,
    "condition": "New — verify before launch"
  },
  {
    "id": 16,
    "category": "Fragrance",
    "brand": "Miss Dior",
    "name": "Absolutely Blooming",
    "variant": "EDP 100 mL",
    "stock": 1,
    "price": 75,
    "condition": "New — verify before launch"
  },
  {
    "id": 17,
    "category": "Fragrance",
    "brand": "Carolina Herrera",
    "name": "Bad Boy",
    "variant": "EDT 100 mL",
    "stock": 2,
    "price": 65,
    "condition": "New — verify before launch"
  },
  {
    "id": 18,
    "category": "Fragrance",
    "brand": "Carolina Herrera",
    "name": "Bad Boy Cobalt",
    "variant": "EDP 100 mL",
    "stock": 1,
    "price": 75,
    "condition": "New — verify before launch"
  },
  {
    "id": 19,
    "category": "Fragrance",
    "brand": "Chanel",
    "name": "Bleu de Chanel",
    "variant": "EDP 100 mL",
    "stock": 1,
    "price": 75,
    "condition": "New — verify before launch"
  },
  {
    "id": 20,
    "category": "Fragrance",
    "brand": "Dior",
    "name": "Homme Intense",
    "variant": "EDP 100 mL",
    "stock": 1,
    "price": 75,
    "condition": "New — verify before launch"
  },
  {
    "id": 21,
    "category": "Fragrance",
    "brand": "Rabanne",
    "name": "Invictus Victory",
    "variant": "EDP 100 mL",
    "stock": 1,
    "price": 55,
    "condition": "New — verify before launch"
  },
  {
    "id": 22,
    "category": "Fragrance",
    "brand": "Rabanne",
    "name": "Phantom Intense",
    "variant": "EDP 100 mL",
    "stock": 1,
    "price": 65,
    "condition": "New — verify before launch"
  },
  {
    "id": 23,
    "category": "Fragrance",
    "brand": "Gucci",
    "name": "Guilty Pour Homme",
    "variant": "EDT 90 mL",
    "stock": 2,
    "price": 65,
    "condition": "New — verify before launch"
  },
  {
    "id": 24,
    "category": "Fragrance",
    "brand": "Dolce & Gabbana",
    "name": "The One for Men",
    "variant": "EDT 100 mL",
    "stock": 1,
    "price": 65,
    "condition": "New — verify before launch"
  },
  {
    "id": 25,
    "category": "Fragrance",
    "brand": "Jean Paul Gaultier",
    "name": "Le Male",
    "variant": "EDT 125 mL",
    "stock": 1,
    "price": 65,
    "condition": "New — verify before launch"
  },
  {
    "id": 26,
    "category": "Fragrance",
    "brand": "Tom Ford",
    "name": "Tobacco Vanille",
    "variant": "EDP 100 mL",
    "stock": 3,
    "price": 100,
    "condition": "New — verify before launch"
  },
  {
    "id": 27,
    "category": "Fragrance",
    "brand": "Tom Ford",
    "name": "Lost Cherry",
    "variant": "EDP 100 mL",
    "stock": 2,
    "price": 100,
    "condition": "New — verify before launch"
  },
  {
    "id": 28,
    "category": "Fragrance",
    "brand": "Creed",
    "name": "Absolu Aventus",
    "variant": "EDP 100 mL",
    "stock": 2,
    "price": 100,
    "condition": "New — verify before launch"
  },
  {
    "id": 29,
    "category": "Fragrance",
    "brand": "Creed",
    "name": "Millésime Impérial",
    "variant": "EDP 100 mL",
    "stock": 1,
    "price": 100,
    "condition": "New — verify before launch"
  },
  {
    "id": 30,
    "category": "Makeup",
    "brand": "SeneGence",
    "name": "LipSense Long-Lasting Liquid Lip Color",
    "variant": "First Love · .25 fl oz / 7.39 mL",
    "stock": 2,
    "price": 12,
    "condition": "New — verify before launch"
  },
  {
    "id": 31,
    "category": "Makeup",
    "brand": "SeneGence",
    "name": "LipSense Long-Lasting Liquid Lip Color",
    "variant": "Mauve Ice · .25 fl oz / 7.39 mL",
    "stock": 2,
    "price": 12,
    "condition": "New — verify before launch"
  },
  {
    "id": 32,
    "category": "Makeup",
    "brand": "SeneGence",
    "name": "LipSense Long-Lasting Liquid Lip Color",
    "variant": "Bombshell · .25 fl oz / 7.39 mL",
    "stock": 2,
    "price": 12,
    "condition": "New — verify before launch"
  },
  {
    "id": 33,
    "category": "Makeup",
    "brand": "SeneGence",
    "name": "LipSense Long-Lasting Liquid Lip Color",
    "variant": "Apple Cider · .25 fl oz / 7.39 mL",
    "stock": 2,
    "price": 12,
    "condition": "New — verify before launch"
  },
  {
    "id": 34,
    "category": "Makeup",
    "brand": "SeneGence",
    "name": "LipSense Long-Lasting Liquid Lip Color",
    "variant": "Nude · .25 fl oz / 7.39 mL",
    "stock": 2,
    "price": 12,
    "condition": "New — verify before launch"
  },
  {
    "id": 35,
    "category": "Makeup",
    "brand": "Too Faced",
    "name": "Born This Way Ethereal Light Concealer",
    "variant": "Espresso · 5 mL / .16 fl oz",
    "stock": 1,
    "price": 15,
    "condition": "New — verify before launch"
  },
  {
    "id": 36,
    "category": "Makeup",
    "brand": "Too Faced",
    "name": "Born This Way Ethereal Light Concealer",
    "variant": "Hot Cocoa · 5 mL / .16 fl oz",
    "stock": 1,
    "price": 15,
    "condition": "New — verify before launch"
  },
  {
    "id": 37,
    "category": "Makeup",
    "brand": "Too Faced",
    "name": "Born This Way Foundation",
    "variant": "Caramel · 30 mL / 1.0 fl oz",
    "stock": 1,
    "price": 24,
    "condition": "New — verify before launch"
  },
  {
    "id": 38,
    "category": "Makeup",
    "brand": "Too Faced",
    "name": "Born This Way Foundation",
    "variant": "Butter Pecan · 30 mL / 1.0 fl oz",
    "stock": 1,
    "price": 24,
    "condition": "New — verify before launch"
  },
  {
    "id": 39,
    "category": "Makeup",
    "brand": "Too Faced",
    "name": "Born This Way Foundation",
    "variant": "Maple · 30 mL / 1.0 fl oz",
    "stock": 2,
    "price": 24,
    "condition": "New — verify before launch"
  },
  {
    "id": 40,
    "category": "Makeup",
    "brand": "Too Faced",
    "name": "Born This Way Soft Matte Foundation",
    "variant": "Sable · 30 mL / 1.0 fl oz",
    "stock": 2,
    "price": 24,
    "condition": "New — verify before launch"
  },
  {
    "id": 41,
    "category": "Makeup",
    "brand": "Too Faced",
    "name": "Born This Way Soft Matte Foundation",
    "variant": "Tiramisu · 30 mL / 1.0 fl oz",
    "stock": 2,
    "price": 24,
    "condition": "New — verify before launch"
  },
  {
    "id": 42,
    "category": "Makeup",
    "brand": "Chanel",
    "name": "N°1 de Chanel Revitalizing Foundation",
    "variant": "BD121 · 30 mL / 1.0 fl oz",
    "stock": 2,
    "price": 40,
    "condition": "New — verify before launch"
  },
  {
    "id": 43,
    "category": "Makeup",
    "brand": "Chanel",
    "name": "N°1 de Chanel Revitalizing Foundation",
    "variant": "BR132 · 30 mL / 1.0 fl oz",
    "stock": 2,
    "price": 40,
    "condition": "New — verify before launch"
  },
  {
    "id": 44,
    "category": "Makeup",
    "brand": "Chanel",
    "name": "N°1 de Chanel Revitalizing Foundation",
    "variant": "B110 · 30 mL / 1.0 fl oz",
    "stock": 1,
    "price": 40,
    "condition": "New — verify before launch"
  },
  {
    "id": 45,
    "category": "Makeup",
    "brand": "Tom Ford",
    "name": "Shade & Illuminate Soft Radiance Foundation SPF 50",
    "variant": "11.5 Warm Nutmeg · 30 mL / 1.0 fl oz",
    "stock": 2,
    "price": 75,
    "condition": "New — verify before launch"
  },
  {
    "id": 46,
    "category": "Makeup",
    "brand": "Tom Ford",
    "name": "Shade & Illuminate Soft Radiance Foundation SPF 50",
    "variant": "11.7 Nutmeg · 30 mL / 1.0 fl oz",
    "stock": 2,
    "price": 75,
    "condition": "New — verify before launch"
  },
  {
    "id": 47,
    "category": "Makeup",
    "brand": "Tom Ford",
    "name": "Shade & Illuminate Soft Radiance Foundation SPF 50",
    "variant": "12.5 Walnut · 30 mL / 1.0 fl oz",
    "stock": 2,
    "price": 75,
    "condition": "New — verify before launch"
  },
  {
    "id": 48,
    "category": "Open Box",
    "brand": "Pat McGrath Labs",
    "name": "Skin Fetish Sublime Perfection Foundation",
    "variant": "Med Deep 25",
    "stock": 1,
    "price": 40,
    "condition": "Open box — pending hygiene/condition review"
  },
  {
    "id": 49,
    "category": "Open Box",
    "brand": "Fenty Beauty",
    "name": "Pro Filt'r Soft Matte Foundation",
    "variant": "506W",
    "stock": 1,
    "price": 38,
    "condition": "Open box — pending hygiene/condition review"
  },
  {
    "id": 50,
    "category": "Open Box",
    "brand": "Fenty Beauty",
    "name": "Pro Filt'r Soft Matte Foundation",
    "variant": "536W",
    "stock": 1,
    "price": 38,
    "condition": "Open box — pending hygiene/condition review"
  },
  {
    "id": 51,
    "category": "Open Box",
    "brand": "Charlotte Tilbury",
    "name": "Airbrush Flawless Foundation",
    "variant": "13 Neutral",
    "stock": 1,
    "price": 40,
    "condition": "Open box — pending hygiene/condition review"
  },
  {
    "id": 52,
    "category": "Open Box",
    "brand": "Lancôme",
    "name": "Teint Idole Ultra Wear Foundation",
    "variant": "525W",
    "stock": 1,
    "price": 40,
    "condition": "Open box — pending hygiene/condition review"
  },
  {
    "id": 53,
    "category": "Open Box",
    "brand": "Lancôme",
    "name": "Teint Idole Ultra Wear Foundation",
    "variant": "535N",
    "stock": 1,
    "price": 40,
    "condition": "Open box — pending hygiene/condition review"
  },
  {
    "id": 54,
    "category": "Open Box",
    "brand": "Laura Mercier",
    "name": "Translucent Loose Setting Powder",
    "variant": "",
    "stock": 1,
    "price": 20,
    "condition": "Open box — pending hygiene/condition review"
  },
  {
    "id": 55,
    "category": "Open Box",
    "brand": "Morphe",
    "name": "Bake & Set Setting Powder",
    "variant": "",
    "stock": 1,
    "price": 20,
    "condition": "Open box — pending hygiene/condition review"
  },
  {
    "id": 56,
    "category": "Open Box",
    "brand": "bareMinerals",
    "name": "Original Loose Setting Powder",
    "variant": "",
    "stock": 1,
    "price": 20,
    "condition": "Open box — pending hygiene/condition review"
  },
  {
    "id": 57,
    "category": "Open Box",
    "brand": "Anastasia Beverly Hills",
    "name": "Loose Setting Powder",
    "variant": "",
    "stock": 1,
    "price": 20,
    "condition": "Open box — pending hygiene/condition review"
  },
  {
    "id": 58,
    "category": "Open Box",
    "brand": "Unspecified",
    "name": "Additional Setting Powder",
    "variant": "Brand/shade not specified",
    "stock": 1,
    "price": 10,
    "condition": "Open box — pending hygiene/condition review"
  },
  {
    "id": 59,
    "category": "Open Box",
    "brand": "Hourglass",
    "name": "Vanish Airbrush Concealer",
    "variant": "Brandy",
    "stock": 1,
    "price": 22,
    "condition": "Open box — pending hygiene/condition review"
  },
  {
    "id": 60,
    "category": "Open Box",
    "brand": "Too Faced",
    "name": "Born This Way Concealer (Mini)",
    "variant": "Cocoa",
    "stock": 1,
    "price": 15,
    "condition": "Open box — pending hygiene/condition review"
  },
  {
    "id": 61,
    "category": "Open Box",
    "brand": "Too Faced",
    "name": "Born This Way Concealer (Mini)",
    "variant": "Chestnut",
    "stock": 1,
    "price": 15,
    "condition": "Open box — pending hygiene/condition review"
  },
  {
    "id": 62,
    "category": "Open Box",
    "brand": "Benefit",
    "name": "Boi-ing Concealer (Mini)",
    "variant": "3E01",
    "stock": 1,
    "price": 15,
    "condition": "Open box — pending hygiene/condition review"
  },
  {
    "id": 63,
    "category": "Open Box",
    "brand": "Tarte",
    "name": "Shape Tape Concealer (Mini)",
    "variant": "Rich Honey",
    "stock": 2,
    "price": 15,
    "condition": "Open box — pending hygiene/condition review"
  },
  {
    "id": 64,
    "category": "Open Box",
    "brand": "Tarte",
    "name": "Shape Tape Concealer (Mini)",
    "variant": "Rich Natural",
    "stock": 1,
    "price": 15,
    "condition": "Open box — pending hygiene/condition review"
  },
  {
    "id": 65,
    "category": "Open Box",
    "brand": "Tarte",
    "name": "Shape Tape Concealer (Mini)",
    "variant": "Rich Caramel",
    "stock": 1,
    "price": 15,
    "condition": "Open box — pending hygiene/condition review"
  },
  {
    "id": 66,
    "category": "Open Box",
    "brand": "Tarte",
    "name": "Shape Tape Concealer (Mini)",
    "variant": "55W",
    "stock": 1,
    "price": 15,
    "condition": "Open box — pending hygiene/condition review"
  },
  {
    "id": 67,
    "category": "Open Box",
    "brand": "NARS",
    "name": "Radiant Creamy Concealer (Mini)",
    "variant": "Med Deep 4",
    "stock": 1,
    "price": 15,
    "condition": "Open box — pending hygiene/condition review"
  },
  {
    "id": 68,
    "category": "Open Box",
    "brand": "NARS",
    "name": "Radiant Creamy Concealer (Mini)",
    "variant": "Med Deep 2.6",
    "stock": 1,
    "price": 15,
    "condition": "Open box — pending hygiene/condition review"
  },
  {
    "id": 69,
    "category": "Open Box",
    "brand": "Benefit",
    "name": "They're Real! Mascara (Mini)",
    "variant": "",
    "stock": 4,
    "price": 12,
    "condition": "Open box — pending hygiene/condition review"
  }
];
