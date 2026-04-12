const express = require("express");
const { init: loaders } = require("./app/loaders/index.js");
const dotenv = require("dotenv");

dotenv.config();

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
    const port = process.env.PORT || "3001";
    this.app.listen(port, (err) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log(`App start to listen at http://localhost:${port}`);
    });
  }
}

const serverInstance = new Server();

serverInstance.startServer();

// const express = require("express");
// const logger = require("morgan");
// const mongoose = require("mongoose");
// const connectDB = require("./app/config/db.config");
// const bodyPraser = require('body-parser')
// const cors = require('cors')
// const app = express();

// const manageRoute = require("./app/routes/manage.route");
// const lightRoute = require("./app/routes/light.route");
// const analysisRoute = require("./app/routes/analysis.route");
// //connect mongodb cloud
// connectDB;

// // middleware
// app.use(logger("dev"));
// app.use(bodyPraser.json())
// app.use(cors())
// // routes

// app.use("/api/manage", manageRoute);
// app.use("/api/light", lightRoute);
// app.use("/api/analysis", analysisRoute);
// //catch 404 error
// app.use((req, res, next) => {
//   const err = new Error("Not Found");
//   err.status = 404;
//   next(err);
// });

// // error handler
// app.use(() => {
//   const error = app.get("env") === "development" ? err : {};
//   const status = err.status || 500;

//   // response to client
//   return res.status(status).json({
//     error: {
//       message: error.message,
//     },
//   });
// });

// // start server
// const port = process.env.PORT || "3001";
// app.listen(port, () => {
//   console.log(`App start to listen at http://localhost:${port}`);
// });
