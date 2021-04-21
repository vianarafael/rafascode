import React, { useState, useEffect, useRef } from "react";
import { Controlled as CodeMirror } from "react-codemirror2";
import options from "../config/codeMirror";
import _ from "lodash";
import "./CodeMirrorComponent.css";
import parseExpressions from "../parseExpressions"
import Terminal from "../components/terminal";
import socketIOClient from "socket.io-client";
const ENDPOINT =  "http://3.14.10.124/"; // "http://127.0.0.1:5000";

require("codemirror/lib/codemirror.css");
require("codemirror/theme/material.css");
require("codemirror/mode/javascript/javascript.js");



function CodeMirrorComponent()
{

  const [value, setValue] = useState("// RafaSCode");
  const [expressionsToBeDisplayed, setExpressionsToBeDisplayed] = useState([]);
  const socket = socketIOClient(ENDPOINT);

  const editorRef = useRef()
  
  function evaluateExpressions(expressions)
  {
    const formattedExpressions = _.mapValues(expressions, expression =>
    {
   
      const result = eval(expression);

      if (result && result.type)
      {
        return result;
      } else if (_.isFunction(result) && result.name)
      {
        return <i>Function {result.name}</i>;
      } else if (_.isBoolean(result))
      {
        return result ? 'True' : 'False';
      } else if (_.isObject(result) || _.isArray(result))
      {
        return JSON.stringify(result);
      }

      return result;
    });
          

    return _.map(formattedExpressions, (expression, line) =>
      <div>{expression}</div>
    );
  }
    
  function createExpression(state)
  {
    let expressions, errors;

    try
    {
      expressions = parseExpressions(state);
    } catch (e)
    {
      errors = e.toString();
   
    }

    return expressions
  }
  
  useEffect(() =>
  {
    socket.on('code', ({value}) =>
    {
      // console.log('receiving', c.value)
      // console.log('ref', editorRef.current)
      // // setValue(c.value)
      setValue(value)
      // document.getElementById("editor").value = value;
    })
  }, [])

  function submitCode()
  {
    socket.emit('code', {value})
  }
      // useEffect(() => {
      //   setExpressionsToBeDisplayed(
      //     evaluateExpressions(createExpression(value))
      //   );
      //   socket.emit('code', { value })
      // }, [value]);
  
      // make a distiction between viewers and the coder - the first person that connects is the viewer
  
      // setTimeout(() => {
      //   socket.on("code", ({ value }) => {
      //     setValue(value);
      //   });
      // }, 1000);

    return (
      <div id="editor-terminal">
        {/* <textarea rows="30" cols="50" id="editor" placeholder="Type Your Text..." onKeyUp={(e) =>
          socket.emit('code', { value: e.target.value })
        }></textarea> */}
 
        <CodeMirror
          ref={editorRef}
          value={value}
          options={options}
          onBeforeChange={(editor, data, value) => {
            // console.log(e.target.value)
          // socket.emit("code", {value})
            setValue(value);
          }} 
        />
        <button onClick={submitCode}>Share the Code</button>
        <Terminal
          expressionsToBeDisplayed={expressionsToBeDisplayed}
          setExpressionsToBeDisplayed={setExpressionsToBeDisplayed}
          evaluateExpressions={evaluateExpressions}
          createExpression={createExpression}
        />
      </div>
    );
}
export default CodeMirrorComponent;
