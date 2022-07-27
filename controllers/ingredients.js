const Ingredient = require('../models/ingredient');

module.exports = {
    index,
    create,

}

function index(req, res) {
    let ingredients;
    let userIngredients;
    let id = req.user._id;
    Ingredient.find({}, function(err, allIngredients){
        ingredients = allIngredients;
        Ingredient.find( {users:{$elemMatch:{userId : req.user._id}}}, function(err, userIngredients){
            if (err) console.log("err");
            res.render('ingredients/index' , {ingredients, userIngredients, id});
        }) 
    })
}

function create(req, res) {
    var ingredient = new Ingredient(req.body);
    ingredient.save(function(err){
        if (err)  {
            console.log(err);
            return res.redirect('/ingredients');
        }
        res.redirect('/ingredients');
    })
}
