import React, { useState } from "react";
import { Controlled as CodeMirror } from "react-codemirror2";
import options from "../config/codeMirror";
import _ from "lodash";
import parseExpressions from "../parseExpressions"
require("codemirror/lib/codemirror.css");
require("codemirror/theme/material.css");
require("codemirror/mode/javascript/javascript.js");


function CodeMirrorComponent() {
  const [value, setValue] = useState("// Hello Dome");
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
          console.log("errors", errors)
      }

    //   return { expressions, errors };
        return expressions
    }
   
    const displayMe = evaluateExpressions(createExpression(value));
    console.log("display", displayMe)
    return (
      <>
        <CodeMirror
          value={value}
          options={options}
          onBeforeChange={(editor, data, value) => {
            setValue(value);
          }}
          onChange={(editor, data, value) => {}}
        />
            <div>{displayMe.length ? displayMe.map(el => el
            ) : "No code, dude"}</div>
      </>
    );
}
export default CodeMirrorComponent;
