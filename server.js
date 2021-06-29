const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const time = require("moment");
const users = [];

const addUser = (id, username, room) => {
  const user = { id, username, room };
  users.push(user);
  return user;
};

const getUser = (id) => {
  return users.find((user) => user.id == id);
};

app.use(express.static(path.join(__dirname, "public")));

io.on("connect", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = addUser(socket.id, username, room);
    socket.join(user.room);

    socket.emit("message", `Welcome to room ${room} ${username}`);

    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        `${user.username} joined the server at ${time().format("H:mm")}`
      );


    socket.on("chat", (msg) => {
      io.to(user.room).emit("chat", {
        body: msg.msg,
        username: msg.username,
        time: time().format("H:mm"),
      });
    });

    socket.on("disconnect", () => {
      socket.broadcast
        .to(user.room)
        .emit("message", `${username} has disconect the server`);
    });
  });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => {
  console.log("Running on port " + PORT);
});
