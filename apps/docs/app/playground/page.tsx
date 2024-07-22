'use client'
import { Editor } from "../components/MainEditor";
import { useState } from "react";

export default function Page(): JSX.Element {
  const [response, setResponse]= useState("");
  return (

    <div className="flex flex-col">
        <div className="flex flex-col space-y-5 ">
          <span> HTML </span>
          <Editor setResponse={setResponse}/>
        </div>
        <div className="flex flex-col">
          Output:-
          <div> {response}</div>
        </div>
    </div>
  );
}

