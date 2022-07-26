var express = require('express');
var router = express.Router();
const ingredientsCtrl = require('../controllers/ingredients');
/* GET users listing. */

router.get('/ingredients', ingredientsCtrl.index);
router.post('/ingredients', ingredientsCtrl.create);

module.exports = router;
