import{u as o,a as c,R as l,m as x,d as a,g as p,f as g}from"./index.9d48d1c3.js";const b=()=>{const i=[{id:"newest",title:"Newest"},{id:"oldest",title:"Oldest"}],r=o(),s=c(),d=t=>{const e=new URLSearchParams;e.append("filter",t),r({pathname:s.pathname,search:`${e}`})};return l.createElement("div",{className:`fixed flex items-center flex-row gap-4 top-[64px] ss:ml-[95px] ${x.value?"ml-[250px]":"ml-[95px]"} pb-3 pt-3 ${a.value?"bg-bgdark text-textdark":"bg-bglight text-textlight"} w-full box-border duration-150`},i.map((t,e)=>l.createElement("div",{key:e,id:"sdafasdfasd",className:`text-sm ${s.search.split("?filter=")[1]===t.id?a.value?"bg-white/30 text-textdark":"bg-black/30 text-white":a.value?"bg-white/10 text-textdark":"bg-black/10 text-textlight"} cursor-pointer w-fit h-fit px-3 py-1 rounded-md ${a.value?"hover:bg-white/30":"hover:bg-black/30"} duration-150`,onClick:async()=>{const n=await p(t.id);g.value=n,d(t.id)}},t.title)))};export{b as default};
