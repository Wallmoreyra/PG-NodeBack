const consolContr = require('../controllers/ConsolCont.js');

const consolHand = async(req, res) => {
    try {
        const consolAPI = await consolContr();
        res.status(200).json(consolAPI);
    } catch (error) {
        res.status(400).json({error:error.message});
    }
};

module.exports = consolHand;