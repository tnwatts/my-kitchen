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


 function update(req, res) {
  // Note the cool "dot" syntax to query on the property of a subdoc
  Ingredient.findOne({'users._id': req.params.id}, function(err, ingredient) {
    // Find the comment subdoc using the id method on Mongoose arrays
    // https://mongoosejs.com/docs/subdocs.html
    const userIngredient = ingredient.users.id(req.params.id);
    console.log(userIngredient);
    console.log(req.user._id)
    // Ensure that the comment was created by the logged in user
    if (!userIngredient.userId.equals(req.user._id)) return res.redirect(`/ingredients`);
    // Update the text of the comment
    userIngredient.qty = req.body.qty;
    // Save the updated book
    ingredient.save(function(err) {
      // Redirect back to the book's show view
      res.redirect(`/ingredients`);
    });
  });
}

