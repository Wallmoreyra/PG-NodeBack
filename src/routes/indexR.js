const { Router } = require('express');
const router = Router();
const { renderIndex } = require('../controllers/indexCont');


router.get('/', renderIndex);


module.exports = router;