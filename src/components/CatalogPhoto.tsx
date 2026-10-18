"use client";
import {useState} from "react";
type Props={url?:string|null;alt:string;className?:string;placeholder?:string};
export default function CatalogPhoto({url,alt,className="product-photo",placeholder="PHOTO PENDING"}:Props){
 const [failed,setFailed]=useState(false);
 if(!url||failed)return <div className="catalog-photo-fallback" role="img" aria-label={alt+": photograph pending"}><span aria-hidden="true">✧</span><small>{url?"PHOTO UNAVAILABLE":placeholder}</small></div>;
 return <img className={className} src={url} alt={alt} loading="lazy" onError={()=>setFailed(true)}/>;
}
