const awilix = require("awilix");
const mongooseLoader = require("./mongoose.js");
const LightController = require("../controllers/LightController.js");
const LightService = require("../services/LightService.js");
const LightRepository = require("../repo/LightRepository.js");

const AreaController = require("../controllers/AreaController.js");
const AreaService = require("../services/AreaService.js");
const AreaRepository = require("../repo/AreaRepository.js");

const ManageController = require("../controllers/manage.controller.js");
const ManageService = require("../services/ManageService.js");
const ManageRepository = require("../repo/ManageRepository.js");

const WaterController = require("../controllers/WaterController.js");
const WaterService = require("../services/WaterService.js");
const PumpRepository = require("../repo/PumpRepository.js");

const container = awilix.createContainer({
  injectionMode: awilix.InjectionMode.PROXY,
});

async function setup(mongooseLoader) {
  container.register({
    lightController: awilix.asClass(LightController),
    lightService: awilix.asClass(LightService),
    lightRepository: awilix.asClass(LightRepository),
    
    areaController: awilix.asClass(AreaController),
    areaService: awilix.asClass(AreaService),
    areaRepository: awilix.asClass(AreaRepository),

    waterController: awilix.asClass(WaterController),
    waterService: awilix.asClass(WaterService),
    pumpRepository: awilix.asClass(PumpRepository),

    manageController: awilix.asClass(ManageController),
    manageService: awilix.asClass(ManageService),
    manageRepository: awilix.asClass(ManageRepository),
    
    db: awilix.asValue(mongooseLoader),
  });
}

module.exports = {
  container,
  setup,
};
