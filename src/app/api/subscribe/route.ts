import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
export const runtime="nodejs";
export async function POST(req:NextRequest){
  try{
    const ct=req.headers.get("content-type")||"";
    if(!ct.includes("application/json"))return NextResponse.json({message:"Invalid request."},{status:415});
    if(Number(req.headers.get("content-length")||0)>2048)return NextResponse.json({message:"Invalid request."},{status:413});
    const origin=req.headers.get("origin");
    if(origin && new URL(origin).host!==req.nextUrl.host)return NextResponse.json({message:"Invalid origin."},{status:403});
    const input=await req.json();
    const email=String(input.email||"").trim().toLowerCase();
    const firstName=String(input.firstName||"").trim().slice(0,80);
    if(input.website)return NextResponse.json({message:"Thank you."});
    if(input.consent!==true)return NextResponse.json({message:"Please agree to receive boutique emails."},{status:400});
    if(email.length>254||!/^\S+@\S+\.\S+$/.test(email))return NextResponse.json({message:"Enter a valid email address."},{status:400});
    if(!process.env.DATABASE_URL)return NextResponse.json({message:"Signups are temporarily unavailable. Please try again later."},{status:503});
    const sql=neon(process.env.DATABASE_URL);
    await sql`INSERT INTO deal_subscribers (email,first_name,status,source) VALUES (${email},${firstName},'confirmed','website') ON CONFLICT (email) DO UPDATE SET first_name=EXCLUDED.first_name, status='confirmed',confirmed_at=now()`;
    const response=NextResponse.json({message:"Welcome to the boutique family! You’re subscribed to our weekly deals."});
    response.cookies.set("dionnes_deals","preview-subscriber",{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/",maxAge:60*60*24*30});
    return response;
  }catch{ return NextResponse.json({message:"We couldn't complete the signup. Please try again."},{status:500});}
}
