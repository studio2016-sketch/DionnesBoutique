"use client";
import {useEffect,useState} from "react";
type Props={url?:string|null;alt:string;className?:string;placeholder?:string;priority?:boolean};
export default function CatalogPhoto({url,alt,className="product-photo",placeholder="PHOTO PENDING",priority=false}:Props){
 const [failed,setFailed]=useState(false);
 useEffect(()=>setFailed(false),[url]);
 if(!url||failed)return <div className="catalog-photo-fallback" role="img" aria-label={alt+": photograph pending"}><span aria-hidden="true">✧</span><small>{url?"PHOTO UNAVAILABLE":placeholder}</small></div>;
 return <img
  className={className} src={url} alt={alt}
  loading={priority?"eager":"lazy"} fetchPriority={priority?"high":"auto"} decoding="async"
  onLoad={event=>{
   const img=event.currentTarget;
   const dpr=Math.max(1,Math.min(window.devicePixelRatio||1,3));
   // Do not enlarge a small original to fill a Retina screen: that causes blur.
   // Preserve the entire product image without stretching or cropping.
   const width=Math.max(1,Math.floor(img.naturalWidth/dpr));
   const height=Math.max(1,Math.floor(img.naturalHeight/dpr));
   img.style.maxWidth=`min(100%, ${width}px)`;
   img.style.maxHeight=`min(100%, ${height}px)`;
   img.style.objectFit="contain";
   img.dataset.imageResolution=`${img.naturalWidth}x${img.naturalHeight}`;
   if(img.naturalWidth<480||img.naturalHeight<480)img.dataset.quality="limited";
  }}
  onError={()=>setFailed(true)}
 />;
}
