import React, { useState } from "react";
import { Controlled as CodeMirror } from "react-codemirror2";
import options from "../config/codeMirror";
require("codemirror/lib/codemirror.css");
require("codemirror/theme/material.css");
require("codemirror/mode/javascript/javascript.js");
// require('codemirror/mode/htmlmixed/htmlmixed.js');

function CodeMirrorComponent() {
  const [value, setValue] = useState("// Hello Dome");
    console.log(value)
  return (
    <CodeMirror
      value={value}
      options={options}
      onBeforeChange={(editor, data, value) => {
        setValue(value);
      }}
      onChange={(editor, data, value) => {}}
    />
  );
}
export default CodeMirrorComponent;
