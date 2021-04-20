import React, { useState, useEffect } from "react";
import { Controlled as CodeMirror } from "react-codemirror2";
import options from "../config/codeMirror";
import _, { update } from "lodash";
import "./CodeMirrorComponent.css";
import parseExpressions from "../parseExpressions"
import Terminal from "../components/terminal";
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:5000";

require("codemirror/lib/codemirror.css");
require("codemirror/theme/material.css");
require("codemirror/mode/javascript/javascript.js");



function CodeMirrorComponent()
{
  const [value, setValue] = useState("// RafaSCode");
  const [expressionsToBeDisplayed, setExpressionsToBeDisplayed] = useState([]);
  const socket = socketIOClient(ENDPOINT);
  
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
    socket.on('code', (c) =>
    {
      console.log('receiving', c.value)
      setValue(c.value)
    })
  })

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
        <CodeMirror
          value={value}
          options={options}
          // onBeforeChange={(editor, data, value) => {
          //         console.log("sending", value);
          //         socket.emit("code", { value });
          // }}
          onKeyUp={(editor, event) =>
          {
            
            console.log(event.target.value)
            socket.emit("code", { value: event.target.value });
          }}
          // onChange={(editor, data, value) => {}}
          // onKeyUp={(editor, data, value) =>
          // {
          //   console.log('sending', value)
          //   socket.emit('code', {value})
          // }
          // }

        />
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
