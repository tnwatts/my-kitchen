const Recipe = require("../models/recipe");
const Ingredient = require("../models/ingredient");

module.exports = {
    index,
    create,
    edit,
    show,
    update,
    updateIngredients
}

function index(req, res) {    
    Recipe.find({}, function(err, recipes){
            res.render('recipes/index' , {recipes});
    })
}

function create(req, res) {
    req.body.user = req.user._id;
    var recipe = new Recipe(req.body);
    recipe.save(function(err){
        if (err)  {
            console.log(err);
            return res.redirect('/ingredients');
        }
        res.redirect(`recipes/${recipe._id}/edit`);
    })
}

function edit(req, res) {
    Ingredient.find({}, function(err, ingredients){
        Recipe.findOne({'_id': req.params.id, 'users': req.user._id}, function(err, recipe){
            if (err) console.log("err");
            res.render(`recipes/edit` , {ingredients, recipe});
        }) 
    })
}

function update(req, res) {
    Recipe.findOne({'_id': req.params.id, 'users': req.user._id}, function(err, recipe){
        if (!recipe.user.equals(req.user._id)) return res.redirect(`/ingredients`);
        recipe.directions = req.body.directions;
        recipe.preparationTime = req.body.preparationTime;
        recipe.name = req.body.name;
        recipe.diet = req.body.diet;
        recipe.save(function(err) {
          res.redirect(`/recipes`);
        });
      });
}

function updateIngredients(req, res) {
    Recipe.findOne({'_id': req.params.id, 'users': req.user._id}, function(err, recipe){
        if (err) console.log(err) //console.log(req.body.addIngredient);
        if (!recipe.user.equals(req.user._id)){
            console.log(reciper.user);
            console.log(req.user._id);
            
            return res.redirect("/");
        }

        if (req.body.addIngredient) recipe.ingredients.push(req.body.addIngredient);
        recipe.save(function(err) {
          res.redirect(`/recipes/${recipe._id}/edit`);
        });
      });
}

function show(req, res) {
    console.log("SHOWHOWOWO");
    Recipe.findOne({'_id': req.params.id}, function(err, recipe){
        if (err) console.log("err");
        res.render(`recipes/show` , {recipe});
    }) 
}