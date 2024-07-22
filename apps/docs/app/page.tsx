'use client'
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react"
import { redirect } from "next/navigation";

export default function Page(): JSX.Element {
  const router = useRouter();
  const pathname = usePathname(); 
  const [lang, setLang]= useState("javascript");
  const addQueryParam = () => {
    const params = new URLSearchParams();
    params.set("lang", lang);
    router.push(`${'/playground'}?${params.toString()}`);
};
  return (
    <div className="flex flex-col">
      <input type="text" placeholder="Enter Language" className="bg-blue-200 border border-black rounded-lg p-3 m-5" onChange={(e)=>{
        setLang(e.target.value);
      }}/>
      <button className="bg-blue-200 rounded-lg p-3 m-5" onClick={addQueryParam}> Enter </button>
    </div>
  )
}
