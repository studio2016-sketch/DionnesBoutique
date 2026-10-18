import { ImageResponse } from "next/og";
export const size={width:1200,height:630};
export const contentType="image/png";
export default function Image(){
 return new ImageResponse(
 <div style={{display:"flex",width:"100%",height:"100%",background:"#f7f0e6",color:"#785526",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:32,border:"24px solid #a77a3f"}}>
  <span style={{fontFamily:"serif",fontSize:94,letterSpacing:4}}>DIONNE’S BOUTIQUE</span>
  <span style={{fontFamily:"serif",fontSize:38}}>Timeless Style. Elevated You.</span>
  <span style={{fontSize:20,letterSpacing:7}}>DESIGNER FRAGRANCE · BEAUTY FINDS</span>
 </div>,size);
}
