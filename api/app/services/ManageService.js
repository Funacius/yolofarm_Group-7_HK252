class ManageService {
    constructor({ manageRepository }) {
      this._manageRepository = manageRepository;
    }

    async getTempThresh(req, res){
        try {
            const temp = await this._manageRepository.getTempThresh();
            return res.status(200).json(temp);
        } catch (error) {
            res.json({
                error: error
            })
        }
      }
    
    async updateTempThresh(req, res){
        try {
            const temp = await this._manageRepository.updateTempThresh(req.params.id, req.body)
            return res.status(200).json(temp);
        } catch (error) {
            res.json({
                error: error
            })
        }
    }

    async getLightThresh(req, res){
        try {
            const temp = await this._manageRepository.getLightThresh();
            return res.status(200).json(temp);
        } catch (error) {
            res.json({
                error: error
            })
        }
      }
    
    async updateLightThresh(req, res){
        try {
            const temp = await this._manageRepository.updateLightThresh(req.params.id, req.body)
            return res.status(200).json(temp);
        } catch (error) {
            res.json({
                error: error
            })
        }
    }

    async getAirThresh(req, res){
        try {
            const temp = await this._manageRepository.getAirThresh();
            return res.status(200).json(temp);
        } catch (error) {
            res.json({
                error: error
            })
        }
      }
    
    async updateAirThresh(req, res){
        try {
            const temp = await this._manageRepository.updateAirThresh(req.params.id, req.body)
            return res.status(200).json(temp);
        } catch (error) {
            res.json({
                error: error
            })
        }
    }

    async getSoilThresh(req, res){
        try {
            const temp = await this._manageRepository.getSoilThresh();
            return res.status(200).json(temp);
        } catch (error) {
            res.json({
                error: error
            })
        }
      }
    
    async updateSoilThresh(req, res){
        try {
            const temp = await this._manageRepository.updateSoilThresh(req.params.id, req.body)
            return res.status(200).json(temp);
        } catch (error) {
            res.json({
                error: error
            })
        }
    }
  }

  
  
  module.exports = ManageService;
  