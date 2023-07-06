import React from "react";
import { useState, useEffect } from "react";
import { TextField, Button } from "@mui/material";
import { io } from "socket.io-client";
import style from "./Chat.module.css";

const url = window.location.href;
const queryString = url.split("?")[1];
const params = queryString.split("&");

let id = null;
params.forEach((param) => {
  const [key, value] = param.split("=");
  if (key === "id") {
    id = value;
    return;
  }
});

const socket = io("http://localhost:3001", { query: { id } });

function Chat() {
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const handleInputChange = (event) => {
    setMessage(event.target.value);
  };

  const sendMsg = () => {
    if (message.trim() !== "") {
      socket.emit("message", message);
      setMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((current) => [...current, data]);
    });

    return () => socket.off("receive_message");
  }, [socket]);


  return (
    <div>
      <div className={style["chat-body"]}>
        {messageList.map((message, index) => (
          <div
            className={`${style["message-container"]} ${
              message.authorId === socket.id && style["message-mine"]
            }`}
            key={index}
          >
            <div className="message-author">
              <strong>{message.author}</strong>
            </div>
            <div className="message-text">{message.text}</div>
          </div>
        ))}
      </div>

      <TextField
        label="Digite sua mensagem"
        value={message}
        onChange={handleInputChange}
      />
      <Button variant="contained" color="primary" onClick={sendMsg}>
        Enviar
      </Button>
    </div>
  );
}

export default Chat;
