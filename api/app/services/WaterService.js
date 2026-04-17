const PumpRepository = require("../repo/PumpRepository");

class WaterService {
  constructor({ pumpRepository }) {
    this._pumpRepository = pumpRepository;
  }

  async getAllPump(req, res) {
    try {
      const pumps = await this._pumpRepository.all();
      return res.status(200).json(PumpRepository.sortPumpsForUi(pumps));
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error.message || "getAllPump failed" });
    }
  }

  async getOnePump(req, res) {
    try {
      const pump = await this._pumpRepository.findPumpById(req.params.id);
      if (!pump) {
        return res.status(404).json({ message: "Pump not found" });
      }
      return res.status(200).json(pump);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error.message || "getOnePump failed" });
    }
  }

  async update(req, res) {
    try {
      const pump_id = req.body.pump_id;
      if (!pump_id) {
        return res.status(400).json({ message: "pump_id is required" });
      }
      await this._pumpRepository.update(pump_id);
      return res.status(200).json({ ok: true });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error.message || "toggle pump failed" });
    }
  }

  async getPumpByAreaId(req, res) {
    try {
      const areaParam = req.params.id;
      await this._pumpRepository.ensureDefaultPumpsForArea(areaParam);
      const raw = await this._pumpRepository.FindByIdArea(String(areaParam));
      const pumps = PumpRepository.sortPumpsForUi(Array.isArray(raw) ? raw : []);
      return res.status(200).json(pumps);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error.message || "getPumpByAreaId failed" });
    }
  }

  async changeAuto(req, res) {
    try {
      const pump_id = req.body.pump_id;
      const mode = req.body.mode;
      const status = req.body.status;
      await this._pumpRepository.updateMode(pump_id, mode, status);
      return res.status(200).json({ ok: true, message: "Auto mode updated" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error.message || "changeAuto failed" });
    }
  }

  async updateMany(req, res) {
    try {
      const pump_id = req.body.pump_id;
      const action = req.body.action;
      const status = req.body.status;
      if (!pump_id) {
        return res.status(400).json({ message: "pump_id is required" });
      }
      await this._pumpRepository.updateMany(pump_id, action, status);
      return res.status(200).json({ ok: true });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error.message || "set pump state failed" });
    }
  }

  async getTimer(req, res) {
    try {
      const pump_id = req.params.id;
      const result = await this._pumpRepository.getTimer(pump_id);
      return res.status(200).json(result);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error.message || "getTimer failed" });
    }
  }

  async updateTimer(req, res) {
    try {
      const pump_id = req.params.id;
      const ontime1 = req.body.startTime1;
      const ontime2 = req.body.startTime2;
      const result = await this._pumpRepository.updateTimer(pump_id, ontime1, ontime2);
      return res.status(200).json(result);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error.message || "updateTimer failed" });
    }
  }
}

module.exports = WaterService;
