import React, { useState, useEffect } from "react";
import { Controlled as CodeMirror } from "react-codemirror2";
import options from "../config/codeMirror";
import _ from "lodash";
import parseExpressions from "../parseExpressions"
import Terminal from "../components/terminal";
import "./CodeMirrorComponent.css"
require("codemirror/lib/codemirror.css");
require("codemirror/theme/material.css");
require("codemirror/mode/javascript/javascript.js");



function CodeMirrorComponent() {
  const [value, setValue] = useState("// RafaSCode");
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

    //   return { expressions, errors };
        return expressions
    }
   
    let [expressionsToBeDisplayed, setExpressionsToBeDisplayed] = useState([]) 
    useEffect(() =>
    {
        setExpressionsToBeDisplayed(evaluateExpressions(createExpression(value)));
        // console.log('da exp', expressionsToBeDisplayed)   
    }, [value])
    return (
      <div id="editor-terminal">
        <CodeMirror
          value={value}
          options={options}
          onBeforeChange={(editor, data, value) => {
            setValue(value);
          }}
          onChange={(editor, data, value) => {}}
        />
   
        <Terminal expressionsToBeDisplayed={expressionsToBeDisplayed} />
      </div>
    );
}
export default CodeMirrorComponent;
