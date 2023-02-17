const express = require("express");
const http = require("http");
const cors = require("cors");
class MagicHotReplacementPlugin {
  constructor(componentConfig) {
    const app = express();
    app.use(cors());

    const server = http.createServer(app);
    const io = require("socket.io")(server, {
      cors: {
        origin: "*", //前端请求地址
        methods: ["GET", "POST"],
        credentials: true,
        allowEIO3: true,
      },
      transport: ["websocket"],
    });
    this.clientSockets = [];
    io.on("connection", (client) => {
      client.emit("ready", componentConfig);
      this.clientSockets.push(client);
      client.on("disconnect", () => {
        /* … */
        const socketIndex = this.clientSockets.indexOf(client);
        this.clientSockets.splice(socketIndex, 1);
      });
    });
    server.listen(1024);
  }
  apply(compiler) {
    compiler.hooks.done.tap("MagicHotReplacementPlugin", () => {
      const options = compiler.options;
      this.clientSockets.forEach((socket) => socket.emit("magicOk"));
    });
  }
}

module.exports = MagicHotReplacementPlugin;
