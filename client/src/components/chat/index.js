import "./chat.css";
import { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:5000";

const Chat = () =>
{
  const [message, setMessage] = useState();
  const [handle, setHandle] = useState();
  const [messages, setMessages] = useState([])

  const socket = socketIOClient(ENDPOINT);
    useEffect(() => {
      console.log('here again')
      // const socket = socketIOClient(ENDPOINT);
      socket.on("chat", (data) =>
      {
        const output = document.getElementById("output")
        output.innerHTML += `<p><strong>${data.handle}</strong>${data.message}</p>`;
      });
    }, []);
  
  const submitMessage = () =>
  {
    socket.emit("chat", {
      handle,
      message
    })
  }
  
  return (
    <div id="chat">
      <div id="chat-window">
        <div id="output"></div>
      </div>
      <input id="handle" type="text" placeholder="User Name" onChange={e => setHandle(e.target.value)} />
      <input id="message" type="text" placeholder="message" onChange={e => setMessage(e.target.value)} />
      <button id="send"
        onClick={submitMessage}
      >Send</button>
    </div>
  );
};

export default Chat