const express = require("express");
const app = express();
const port = 3000;

const publisherRouter = require("./routes/publisher");
const subscriberRouter = require("./routes/subcriber");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/subcriber", subscriberRouter);
app.use("/publisher", publisherRouter);

app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
