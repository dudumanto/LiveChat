import React  from 'react';
import {useState, useEffect} from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

function MyComponent() {
const [text, setText] = useState("teste");
const [socket] = useState( new WebSocket('ws://localhost:8080'))


function teste(){
  socket.send(text);
}


// WEB SOCKET PAPAI==============================================
useEffect(() => {
  // Função que será executada apenas uma vez
}, []); 

var messageContainer = document.getElementById('messages');

socket.onopen = function() {
  console.log('Conexão estabelecida com sucesso.');
};

socket.onmessage = function(event) {
  console.log('Mensagem recebida:', event);
};

socket.onmessage = function(event) {
  var message = document.createElement('div');
  message.textContent = event.data;
};
// FIM WEB SOCKET================================================


  return (
    <div>

      <h1>WebSocket CHAT</h1>
      <TextField id="outlined-basic" onChange={(e)=>setText(e.target.value) } label="Msg" />
      <Button onClick={()=>teste()} variant="contained">Enviar</Button>

    </div>
  );
}

export default MyComponent;