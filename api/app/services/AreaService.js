class AreaService {
  constructor({ areaRepository }) {
    this._areaRepository = areaRepository;
  }

  getAllArea() {
    try {
      
      return this._areaRepository.all();
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = AreaService;
