const Ingredient = require('../models/ingredient');

module.exports = {
    create,
    delete: deleteIngredient,
    update
}

function create(req, res){
    Ingredient.findById(req.params.id, function(err, ingredient){
        req.body.userId = req.user._id;
        ingredient.users.push(req.body);
        ingredient.save(function(err) {
            if (err) console.log("didnt save userIngredient");
            res.redirect('/ingredients');
        })
    })
}

async function deleteIngredient(req, res, next) {
    try {
      const ingredient = await Ingredient.findOne({'users._id': req.params.id, 'users.userId': req.user._id});
      if (!ingredient) throw new Error('Nice Try!');
      ingredient.users.remove(req.params.id);
      await ingredient.save();
      res.redirect(`/ingredients`);
    } catch (err) {
      return next(err);
    }
  }
  function update(req, res){
}