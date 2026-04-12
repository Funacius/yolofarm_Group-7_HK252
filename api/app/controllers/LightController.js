class LightController {
  constructor({ lightService }) {
    this._lightService = lightService;
    this.getAll = this.getAll.bind(this);
    this.getLightById = this.getLightById.bind(this);
    this.changeStateLight = this.changeStateLight.bind(this);
    this.getLightByAreaId = this.getLightByAreaId.bind(this);
    this.changeAuto = this.changeAuto.bind(this);
    this.changeLightOn = this.changeLightOn.bind(this);
    this.getTimer = this.getTimer.bind(this);
    this.updateTimer = this.updateTimer.bind(this);
    this.createTimer = this.createTimer.bind(this);
  }
  async getAll(req, res) {
    return this._lightService.getAllLight(req, res);
  }

  async getLightById(req, res) {
    try {
      const light = await this._lightService.getOneLight(req, res);
      // .then((res) => console.log(res));
      return res.status(200).json(light);
    } catch (error) {
      console.log(error);
    }
  }

  async changeStateLight(req, res) {
    try {
      return await this._lightService.update(req, res);
      // .then((result) => console.log(result));
    } catch (error) {
      console.log(error);
    }
  }

  async getLightByAreaId(req, res) {
    try {
      this._lightService.getLightByAreaId(req, res).then((result) => {
        const bulbs = result;
        // console.log(bulbs);
        return res.status(200).json(bulbs);
      });
    } catch (error) {
      console.log(error);
    }
  }
  async changeAuto(req, res) {
    try {
      this._lightService.changeAuto(req, res);
      // .then((res) => console.log(res));
      return res.status(200).json("The Auto Change");
    } catch (error) {
      console.log(error);
    }
  }

  async changeLightOn(req, res) {
    try {
      this._lightService.updateMany(req, res);
      return res.status(200).json("Updated Lights Successfull");
    } catch (error) {
      console.log(error);
    }
  }

  async updateTimer(req, res) {
    try {
      this._lightService.updateTimer(req, res).then((result) => {
        // console.log(res);
        return res.status(200).json(result);
      });
    } catch (error) {
      console.log(error);
    }
  }

  async getTimer(req, res) {
    try {
      this._lightService.getTimer(req, res).then((result) => {
        return res.status(200).json(result);
      });
    } catch (error) {
      console.log(error);
    }
  }

  async createTimer(req, res) {
    try {
      this._lightService.creatTimer(req, res).then((res) => console.log(res));
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = LightController;
