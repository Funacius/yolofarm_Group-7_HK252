class LightService {
  constructor({ lightRepository }) {
    this._lightRepository = lightRepository;
  }
  async getAllLight(req, res) {
    try {
      const lights = await this._lightRepository.all();

      return res.status(200).json(lights);
    } catch (error) {
      console.log(error);
    }
  }

  async getOneLight(req, res) {
    try {
      return this._lightRepository.findLightById(req.params.id);
    } catch (error) {
      console.log(error);
    }
  }

  async update(req, res) {
    try {
      const bulb_id = req.body.bulb_id;
      // console.log("service", bulb_id);
      await this._lightRepository.update(bulb_id);
    } catch (error) {
      console.log(error);
    }
  }

  async getLightByAreaId(req, res) {
    try {
      return this._lightRepository.FindByIdArea(req.params.id);
    } catch (error) {
      console.log(error);
    }
  }

  async changeAuto(req, res) {
    try {
      const bulb_id = req.body.bulb_id;
      const mode = req.body.mode;
      const status = req.body.status;
      // console.log(bulb_id, mode, status);
      return this._lightRepository.updateMode(bulb_id, mode, status);
    } catch (error) {
      console.log(error);
    }
  }

  async updateMany(req, res) {
    try {
      const bulb_id = req.body.bulb_id;
      const action = req.body.action;
      const status = req.body.status;
      return this._lightRepository.updateMany(bulb_id, action, status);
    } catch (error) {
      console.log(error);
    }
  }

  async getTimer(req, res) {
    try {
      const bulb_id = req.params.id;
      return this._lightRepository.getTimer(bulb_id);
    } catch (error) {
      console.log(error);
    }
  }

  async updateTimer(req, res) {
    try {
      const bulb_id = req.params.id;
      const ontime = req.body.startTime;
      const offtime = req.body.endTime;
      return this._lightRepository.updateTimer(bulb_id, ontime, offtime);
    } catch (error) {
      console.log(error);
    }
  }

}

module.exports = LightService;
