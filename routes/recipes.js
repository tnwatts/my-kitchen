var express = require('express');
var router = express.Router();
const recipesCtrl = require('../controllers/recipes');


router.get('/recipes/available', recipesCtrl.available);
// router.get('/recipes/showAvailable', recipesCtrl.showAvailable)
router.get('/recipes', recipesCtrl.index);
router.post('/recipes', recipesCtrl.create);
router.get('/recipes/:id', recipesCtrl.show);
router.put('/recipes/:id', recipesCtrl.update);
router.put('/recipes/:id/updateIng', recipesCtrl.updateIngredients);
router.get('/recipes/:id/edit', recipesCtrl.edit);

// router.get('/recipes/:id/nw', recipesCtrl.new)


module.exports = router;