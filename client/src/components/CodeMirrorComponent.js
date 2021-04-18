import React, { useState, useEffect } from "react";
import { Controlled as CodeMirror } from "react-codemirror2";
import options from "../config/codeMirror";
import _, { update } from "lodash";
import "./CodeMirrorComponent.css";
import parseExpressions from "../parseExpressions"
import Terminal from "../components/terminal";
import socketIOClient from "socket.io-client";
import { Expression } from "babel-standalone";
const ENDPOINT = "http://127.0.0.1:5000";

require("codemirror/lib/codemirror.css");
require("codemirror/theme/material.css");
require("codemirror/mode/javascript/javascript.js");



function CodeMirrorComponent() {
  const [value, setValue] = useState("// RafaSCode");
  const [expressionsToBeDisplayed, setExpressionsToBeDisplayed] = useState([]); 
  const [receivingData, setReceivingData] = useState(false)
  const socket = socketIOClient(ENDPOINT);

  // useEffect(() =>
  // {
  //       socket.emit("code", {value})
  //       // setExpressionsToBeDisplayed(
  //       //   evaluateExpressions(createExpression(value))
     
  // }, [value]);
  
  // useEffect(() =>
  // {
  //   socket.on("code", ({ value }) =>
  //   {
  //         setValue(value)
  //         setExpressionsToBeDisplayed(
  //         evaluateExpressions(createExpression(value)))
  //   })
  // })


  
    function evaluateExpressions(expressions)
    {
        const formattedExpressions = _.mapValues(expressions, expression => {
   
            const result = eval(expression);

      if (result && result.type) {
        return result;
      } else if (_.isFunction(result) && result.name) {
        return <i>Function {result.name}</i>;
      } else if (_.isBoolean(result)) {
        return result ? 'True' : 'False';
      } else if (_.isObject(result) || _.isArray(result)) {
        return JSON.stringify(result);
      }

      return result;
    });
          

    return _.map(formattedExpressions, (expression, line) =>
      <div>{expression}</div>
    );
      }
    
    function createExpression(state) {
      let expressions, errors;

      try {
          expressions = parseExpressions(state);
      } catch (e) {
          errors = e.toString();
   
      }

        return expressions
    }

      useEffect(() => {
        setExpressionsToBeDisplayed(
          evaluateExpressions(createExpression(value))
        );
        // console.log('da exp', expressionsToBeDisplayed)
      }, [value]);

  useEffect(() =>
  {
   socket.emit("code", { value, expressionsToBeDisplayed })
    
  }, [expressionsToBeDisplayed])

    
  const [displayExp, setDisplayExp] = useState()

 
   

    return (
      <div id="editor-terminal">
        <CodeMirror
          value={value}
          options={options}
          onBeforeChange={(editor, data, value) => {
            setValue(value);
          }}
          onChange={(editor, data, value) => {}}
          onKeyUp={(editor, data, v) =>
          {
            if (data.keyCode === 13)
            {
              setExpressionsToBeDisplayed(evaluateExpressions(createExpression(value)));
            }
            
          }}
        />
        <button onClick={() =>
        {
          console.log('inside')
          console.log('value', value)
          console.log('expressionsToBeDisplayed', expressionsToBeDisplayed);
          socket.on("code", data =>
          {
            setValue(data.value)
          })
        }}>Check</button>
   
        <Terminal expressionsToBeDisplayed={expressionsToBeDisplayed} />
      </div>
    );
}
export default CodeMirrorComponent;
