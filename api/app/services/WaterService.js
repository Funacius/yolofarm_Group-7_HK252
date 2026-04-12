class WaterService {
  constructor({ pumpRepository }) {
    this._pumpRepository = pumpRepository;
  }
  async getAllPump(req, res) {
    try {
      const pumps = await this._pumpRepository.all();

      return res.status(200).json(pumps);
    } catch (error) {
      console.log(error);
    }
  }

  async getOnePump(req, res) {
    try {
      return this._pumpRepository.findPumpById({ id: req.params.id });
    } catch (error) {
      console.log(error);
    }
  }

  async update(req, res) {
    try {
      const pump_id = req.body.pump_id;
      // const pump = this._pumpRepository.findPumpById(pump_id);
      await this._pumpRepository.update(pump_id);
    } catch (error) {
      console.log(error);
    }
  }

  async getPumpByAreaId(req, res) {
    try {
      return this._pumpRepository.FindByIdArea(req.params.id);
    } catch (error) {
      console.log(error);
    }
  }

  async changeAuto(req, res) {
    try {
      const pump_id = req.body.pump_id;
      const mode = req.body.mode;
      const status = req.body.status;
      // console.log(pump_id, mode, status);
      return this._pumpRepository.updateMode(pump_id, mode, status);
    } catch (error) {
      console.log(error);
    }
  }

  async updateMany(req, res) {
    try {
      const pump_id = req.body.pump_id;
      const action = req.body.action;
      const status = req.body.status;
      return this._pumpRepository.updateMany(pump_id, action, status);
    } catch (error) {
      console.log(error);
    }
  }

  async getTimer(req, res) {
    try {
      const pump_id = req.params.id;
      return this._pumpRepository.getTimer(pump_id);
    } catch (error) {
      console.log(error);
    }
  }

  async updateTimer(req, res) {
    try {
      const pump_id = req.params.id;
      const ontime1 = req.body.startTime1;
      const ontime2 = req.body.startTime2;
      return this._pumpRepository.updateTimer(pump_id, ontime1, ontime2);
    } catch (error) {
      console.log(error);
    }
  }

}

module.exports = WaterService;
