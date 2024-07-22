"use client";

import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";
import { useCallback, useEffect, useState } from "react";

export function CollaborativeEditor() {
 
  const [element, setElement] = useState<HTMLElement>();
  const ref = useCallback((node: HTMLElement | null) => {
    if (!node) return;
    setElement(node);
  }, []);

  useEffect(() => {
    let view: EditorView;
    const state = EditorState.create({

      extensions: [
        basicSetup,
        javascript(),    
      ],
    });

    view = new EditorView({
      state,
      parent: element,
    });

    return () => {
      view?.destroy();
    };
  }, [element]);

  return (
    <div>
      <div ref={ref}></div>
    </div>
  );
}
