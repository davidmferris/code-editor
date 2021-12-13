import MonacoEditor, { EditorDidMount } from "@monaco-editor/react";
import prettier from "prettier";
import parser from "prettier/parser-babel";
import { useRef } from "react";
import codeShift from "jscodeshift";
import Highlighter from "monaco-jsx-highlighter";

import "./code-editor.css";
import "./syntax.css";

interface Props {
  initialValue: string;
  onChange: (value: string) => void;
}

const CodeEditor = ({ initialValue, onChange }: Props) => {
  const editorRef = useRef<any>();

  const onEditorDidMount: EditorDidMount = (getValue, monacoEditor) => {
    editorRef.current = monacoEditor;
    monacoEditor.onDidChangeModelContent(() => {
      onChange(getValue());
    });

    monacoEditor.getModel()?.updateOptions({ tabSize: 2 });

    const highlighter = new Highlighter(
      // @ts-ignore
      window.monaco,
      codeShift,
      monacoEditor
    );

    highlighter.highLightOnDidChangeModelContent(
      () => {},
      () => {},
      undefined,
      () => {}
    );
  };

  const onFormatClick = () => {
    const unformatted = editorRef.current.getModel().getValue();
    const formatted = prettier
      .format(unformatted, {
        parser: "babel",
        plugins: [parser],
        useTabs: false,
        semi: true,
        singleQuote: true,
      })
      .replace(/\n$/, "");

    editorRef.current.setValue(formatted);
  };

  return (
    <div className="editor-wrapper">
      <button
        className="button button-format is-primary is-small"
        onClick={onFormatClick}
      >
        Format
      </button>
      <MonacoEditor
        editorDidMount={onEditorDidMount}
        height="100%"
        language="javascript"
        options={{
          automaticLayout: true,
          folding: false,
          fontSize: 16,
          lineNumbersMinChars: 3,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          showUnused: false,
          wordWrap: "on",
        }}
        theme="dark"
        value={initialValue}
      />
    </div>
  );
};

export default CodeEditor;
