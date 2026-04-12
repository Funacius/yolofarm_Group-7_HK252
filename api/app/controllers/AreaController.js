class AreaController {
  constructor({ areaService }) {
    this._areaService = areaService;
    this.getAll = this.getAll.bind(this);
  }
  async getAll(req, res) {
    try {
      const areas = this._areaService.getAllArea().then((result) => {
        const areas = result;
        // console.log(areas);
        return res.status(200).json(areas);
      });
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = AreaController;
