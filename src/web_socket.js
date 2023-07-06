const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: { origin: "http://localhost:3000" },
});
const mysql = require("mysql");
const { type } = require("os");
const PORT = 3001;
// =====================   CONEXÃO COM O BANCO    ==========//

io.on("connection", async (socket) => {
  try {
    const id = socket.handshake.query.id;
    const userInfo = await getUser(id);
    socket.data.username = userInfo.Nome;
    console.log("Usuario conectado: " +  JSON.stringify(userInfo));

    socket.on("disconnect", (reason) => {
      console.log("Usuário desconectado!", socket.data.username);
    });

    socket.on("message", async (text) => {
      io.emit("receive_message", {
        text,
        authorId: socket.id,
        author: socket.data.username,
      });
      console.log(socket.data.username + " ENVIOU PARA O SOCKET: " + text + "\n ARMAZENANDO...");
      const save = await saveMessage(userInfo.ComercialNome, userInfo.CadastroID, userInfo.Nome, text);
      console.log(save)
    });
  } catch (error) {
    console.error("Erro ao obter o usuário:", error);
  }
});


function getUser(id) {
  return new Promise((resolve, reject) => {
    const connection = mysql.createConnection({
      host: "186.202.133.41",
      user: "rotadoreparador",
      password: "rotainsorg34",
      database: "rotadoreparador",
    });
    connection.connect((error) => {
      if (error) {
        console.error("Erro ao conectar ao banco de dados:", error);
        reject(error);
      } else {
        console.log("Conexão estabelecida com sucesso!");

        const sql = `SELECT ComercialNome, CadastroID, Nome, Cpf ,Sexo FROM Cadastro WHERE CadastroID = ${mysql.escape(
          id
        )}`;

        connection.query(sql, (error, results, fields) => {
          if (error) {
            console.error("Ocorreu um erro durante a consulta:", error);
            connection.end();
            reject(error);
          } else {
            const userInfo = results;  
            connection.end();
            resolve(userInfo[0]);
          }
        });
      }
    });
  });
}

function saveMessage(nomeOficina, cadastroID, nome, mensagem) {
  return new Promise((resolve, reject) => {
    const connection = mysql.createConnection({
      host: "186.202.133.41",
      user: "rotadoreparador",
      password: "rotainsorg34",
      database: "rotadoreparador",
    });
    connection.connect((error) => {
      if (error) {
        console.error("Erro ao conectar ao banco de dados:", error);
        reject(error);
      } else {
        console.log("Conexão estabelecida com sucesso!");

        const insert = {
          NomeOficina: nomeOficina,
          CadastroID: cadastroID,
          Nome: nome,
          Mensagem: mensagem
        };
        const sql = 'INSERT INTO chat SET ?';

        // Executa o INSERT passando os valores
      
        // const sql = `INSERT INTO chat (Mensagem, Nome ) VALUES (${mensagem, nome})`;
        
      
    
        connection.query(sql,insert, (error, results, fields) => {
          if (error) {
            console.error("Ocorreu um erro durante O insert:", error);
            connection.end();
            reject(error);
          } else {

            console.log("Resultado do INSERT: " + results);
            const insertResult = results;
            connection.end();
            resolve(insertResult);

          }
        });
      }
    });
  });
}

server.listen(PORT, () => console.log("Server running..."));
