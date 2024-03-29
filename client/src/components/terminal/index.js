import './terminal.css'
import { useEffect } from 'react';

import socketIOClient from "socket.io-client";
const ENDPOINT = "http://3.14.10.124/"; // "http://127.0.0.1:5000";

const Terminal = ({
  expressionsToBeDisplayed,
  setExpressionsToBeDisplayed,
  evaluateExpressions,
  createExpression,
}) =>
{

  useEffect(() => {

    const socket = socketIOClient(ENDPOINT);
    socket.on("code", ({ value }) => {

      setExpressionsToBeDisplayed(evaluateExpressions(createExpression(value)));
    });
  }, []);
  return (
    <div id="terminal">
      <section id="terminal__bar">
        <div id="bar__buttons">
          <button class="bar__button" id="bar__button--exit">
            &#10005;
          </button>
          <button class="bar__button">&#9472;</button>
          <button class="bar__button">&#9723;</button>
        </div>
        <p id="bar__user">rafascode@ubuntu: ~</p>
      </section>

      <section id="terminal__body">
        <div id="terminal__prompt">
          <span id="terminal__prompt--user">rafascode@ubuntu:</span>
          <span id="terminal__prompt--location">~</span>
          <span id="terminal__prompt--bling">$</span>
          <span id="terminal__prompt--cursor"></span>
          <div id="expression-display">
            {expressionsToBeDisplayed.length ? (
              expressionsToBeDisplayed.map((el) => (
                <span style={{ color: "white" }}>{el}</span>
              ))
            ) : (
              <span style={{ color: "red" }}>Error</span>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Terminal;