const { expressLoader } = require("./expess.js");
const mongooseLoader = require("./mongoose.js");

async function init({ expressApp }) {
  await mongooseLoader();
  console.log("MongoDB Initialized");
  await expressLoader({ app: expressApp });
  console.log("Express Initialized");
}

module.exports = { init };