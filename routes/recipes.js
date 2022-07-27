var express = require('express');
var router = express.Router();
const recipesCtrl = require('../controllers/recipes');


router.get('/recipes', recipesCtrl.index);
router.post('/recipes', recipesCtrl.new);
// router.get('/recipes/:id/edit', recipesCtrl.edit);

// router.get('/recipes/:id/new', recipesCtrl.new)


module.exports = router;