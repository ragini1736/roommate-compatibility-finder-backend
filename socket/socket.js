const { Server } = require("socket.io");

let io;

function setupSocket(server) {
  io = new Server(server, {
    cors: { origin: "*" }
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("sendMessage", (data) => {
      io.emit("receiveMessage", data);
    });
  });

  return io;
}

function getIO() {
  if (!io) throw new Error("Socket not initialized");
  return io;
}

module.exports = { setupSocket, getIO };