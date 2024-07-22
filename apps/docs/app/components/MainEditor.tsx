/* eslint-env browser */
"use client";
import "./Common.css";
import * as Y from "yjs";
// @ts-ignore
import { yCollab } from "y-codemirror.next";
import { WebrtcProvider } from "y-webrtc";
import React, { useRef, useEffect, useState } from "react";

import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";

import { html } from "@codemirror/lang-html";
import { sql } from "@codemirror/lang-sql";
import { javascript } from "@codemirror/lang-javascript";
import { css } from "@codemirror/lang-css";

import * as random from "lib0/random";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import {cache} from 'react'

export const usercolors = [
  { color: "#30bced", light: "#30bced33" },
  { color: "#6eeb83", light: "#6eeb8333" },
  { color: "#ffbc42", light: "#ffbc4233" },
  { color: "#ecd444", light: "#ecd44433" },
  { color: "#ee6352", light: "#ee635233" },
  { color: "#9ac2c9", light: "#9ac2c933" },
  { color: "#8acb88", light: "#8acb8833" },
  { color: "#1be7ff", light: "#1be7ff33" },
];

// select a random color for this user
export const userColor = usercolors[random.uint32() % usercolors.length];

//Creating a mapping for the languages
const getLanguagefromString = {
  javascript: javascript,
  sql: sql,
  html: html,
  css: css,
};

export function Editor({setResponse}) {
  const [input, setInput] = useState();
  const router = useRouter();
  const searchParams = useSearchParams();
  const lang = searchParams.get("lang");

  const myHeading = useRef<HTMLDivElement>();

  const sendCode = async () => {
    const headers = {
      "Content-Type": "application/json",
    };
    await axios
      .post(
        "http://localhost:3000/run",{
          language: "cpp",
          code: String(input)
        },
        { headers }
      )
      .then((response) => {
        const cleanedOutput = response.data.output.replace(/[^\x20-\x7E]|[$]/g, '');
        console.log(cleanedOutput);
        setResponse(cleanedOutput);
      })
      .catch((err) => {
        console.log(err.request.response);
      });
  };
  
  const getResponse = cache(sendCode)

  useEffect(() => {
    if (!lang) return;
    const language = getLanguagefromString[lang as string] || javascript;
    const ydoc = new Y.Doc();
    const provider = new WebrtcProvider("codemirror6-demo-room-Editor", ydoc);

    const ytext = ydoc.getText("codemirror");

    const undoManager = new Y.UndoManager(ytext);

    provider.awareness.setLocalStateField("user", {
      name: "Anonymous " + Math.floor(Math.random() * 100),
      color: userColor.color,
      colorLight: userColor.light,
    });

    const updateEditorContent = () => {
      //This will store all the text inside the codeEditor box
      //@ts-ignore
      setInput(ytext.toString());
    };

    ytext.observe(updateEditorContent); //The ytext.observe function is used to observe changes to the Y.Text instance and call updateEditorContent accordingly.

    const state = EditorState.create({
      doc: ytext.toString(),
      extensions: [
        basicSetup,
        language(),
        yCollab(ytext, provider.awareness, { undoManager }),
        EditorView.lineWrapping,
      ],
    });

    const view = new EditorView({
      state,
      parent: myHeading.current,
    });

    return () => {
      provider.destroy();
      view.destroy();
    };
  }, [lang]);

  return (
    <div className="a-demo-cm6 cm-editor-wrap">
      <input type="hidden" />
      <div className="cm-editor">
        <div className="cm-scroller flex space-x-3">
          <div className="cm-gutters "></div>
          <div className="cm-content">
            <div className="bg-blue-100" ref={myHeading}></div>
          </div>
          <div className="container mx-[500px] px-10">
            <div className="flex">
              <p> CODE: </p>
              <button onClick={sendCode}>RUN</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


/*In this code:

A new state variable editorContent is created to store the content of the CodeMirror editor.
The updateEditorContent function updates the state variable editorContent whenever the content of the editor changes.
The ytext.observe function is used to observe changes to the Y.Text instance and call updateEditorContent accordingly.
The current content of the editor is displayed below the editor in a <pre> tag for demonstration purposes.*/
