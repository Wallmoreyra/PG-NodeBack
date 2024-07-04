const companyContr = require('../controllers/CompCont.js');

const companyHand = async(req, res) => {
    try {
        const companyAPI = await companyContr();
        res.status(200).json(companyAPI);
    } catch (error) {
        res.status(400).json({error:error.message});
    }
};

module.exports = companyHand;