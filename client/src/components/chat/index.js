import "./chat.css";
import { useEffect } from "react";
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:5000";

const Chat = () =>
{
    useEffect(() => {
      console.log('here again')
      const socket = socketIOClient(ENDPOINT);
      socket.on("chat", (data) => {
        console.log(data);
      });
    }, []);
  return (
    <h1>Chat</h1>
  );
};

export default Chat