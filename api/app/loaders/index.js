const {expressLoader} = require("./expess.js");
const mongooseLoader = require("./mongoose.js");



async function init({ expressApp }) {
  const mongoConnection = await mongooseLoader();
  console.log("MongoDB Initialized");
  await expressLoader({ app: expressApp });
  console.log("Express Initialized");
  // Logger.info('✌️ Dependency Injector loaded');
}

module.exports = { init };
