"use client";
import {useEffect,useState} from "react";
type Props={url?:string|null;alt:string;className?:string;placeholder?:string;priority?:boolean};
export default function CatalogPhoto({url,alt,className="product-photo",placeholder="PHOTO PENDING",priority=false}:Props){
 const [failed,setFailed]=useState(false);
 useEffect(()=>setFailed(false),[url]);
 if(!url||failed)return <div className="catalog-photo-fallback" role="img" aria-label={alt+": photograph pending"}><span aria-hidden="true">✧</span><small>{url?"PHOTO UNAVAILABLE":placeholder}</small></div>;
 return <img className={className} src={url} alt={alt} loading={priority?"eager":"lazy"} fetchPriority={priority?"high":"auto"} decoding="async" onError={()=>setFailed(true)}/>;
}
