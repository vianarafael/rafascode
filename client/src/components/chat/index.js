import "./chat.css";
import { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
const ENDPOINT =   "http://3.14.10.124/"; // "http://127.0.0.1:5000";

const Chat = () =>
{
  const [message, setMessage] = useState();
  const [handle, setHandle] = useState();

  const socket = socketIOClient(ENDPOINT);
    useEffect(() => {
      console.log('here again')
      socket.on("chat", (data) =>
      {
        const output = document.getElementById("output")
        output.innerHTML += `<p><strong>${data.handle}:</strong> ${data.message}</p>`;
      });
    }, []);
  
  const submitMessage = () =>
  {
    socket.emit("chat", {
      handle,
      message
    })
    // empty the field
    document.getElementById("message").value = ""
    setMessage("")
  }
  
  return (
    <div id="chat">
      <div id="chat-window">
        <div id="output"></div>
      </div>
      <div id="input-section">
        <input
          id="handle"
          type="text"
          placeholder="User Name"
          onChange={(e) => setHandle(e.target.value)}
        />

        <input
          id="message"
          type="text"
          placeholder="message"
          onChange={(e) => setMessage(e.target.value)}
        />
        <button id="send" onClick={submitMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat