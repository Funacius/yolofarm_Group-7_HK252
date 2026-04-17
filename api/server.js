const express = require("express");
const { once } = require("events");
const { init: loaders } = require("./app/loaders/index.js");
const dotenv = require("dotenv");

dotenv.config();

let httpServerRef = null;

function gracefulShutdown(signal) {
  return () => {
    console.log(`[server] Nhận ${signal} — giải phóng port...`);
    if (!httpServerRef) {
      process.exit(0);
      return;
    }
    httpServerRef.close((err) => {
      if (err) console.error("[server] close:", err.message);
      process.exit(err ? 1 : 0);
    });
  };
}

class Server {
  constructor() {
    if (Server.instance) {
      return Server.instance;
    }
    this.app = express();
    Server.instance = this;
  }

  async startServer() {
    await loaders({ expressApp: this.app });
    const port = Number(process.env.PORT) || 3001;
    const maxAttempts = Number(process.env.PORT_BIND_RETRIES) || 25;

    let httpServer = null;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      httpServer = this.app.listen(port);
      try {
        await once(httpServer, "listening");
        break;
      } catch (err) {
        await new Promise((resolve) => httpServer.close(() => resolve()));
        if (err.code !== "EADDRINUSE" || attempt === maxAttempts - 1) {
          if (err.code === "EADDRINUSE") {
            console.error(
              `[server] Port ${port} vẫn bận sau ${maxAttempts} lần thử.\n` +
                `  Windows: netstat -ano | findstr :${port}  →  taskkill /F /PID <pid>\n` +
                `  Hoặc đổi PORT trong api/.env`
            );
          } else {
            console.error("[server]", err);
          }
          process.exit(1);
          return;
        }
        const delayMs = 120 + attempt * 80;
        console.warn(
          `[server] Port ${port} tạm bận (nodemon?) — thử lại sau ${delayMs}ms (${attempt + 1}/${maxAttempts})...`
        );
        await new Promise((r) => setTimeout(r, delayMs));
      }
    }

    httpServerRef = httpServer;
    console.log(`App start to listen at http://localhost:${port}`);

    process.on("SIGTERM", gracefulShutdown("SIGTERM"));
    process.on("SIGINT", gracefulShutdown("SIGINT"));
  }
}

const serverInstance = new Server();

serverInstance.startServer();
