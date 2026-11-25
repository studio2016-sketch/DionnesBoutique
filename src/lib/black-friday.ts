export const SALE_END = Date.parse("2026-12-01T06:00:00Z");
export const saleActive = (now = Date.now()) => now < SALE_END;
export const merchandiseCents = (price: number, now = Date.now()) => Math.round(Math.round(price * 100) * (saleActive(now) ? 0.5 : 1));
export const merchandisePrice = (price: number, now = Date.now()) => merchandiseCents(price, now) / 100;
