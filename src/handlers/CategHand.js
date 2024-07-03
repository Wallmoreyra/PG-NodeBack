const categContr = require('../controllers/CategCont.js');

const categHand = async(req, res) => {
    try {
        const categAPI = await categContr();
        res.status(200).json(categAPI);
    } catch (error) {
        res.status(400).json({error:error.message});
    }
};

module.exports = categHand;