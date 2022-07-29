const Recipe = require("../models/recipe");
const Ingredient = require("../models/ingredient");

module.exports = {
    index,
    create,
    edit,
    show,
    update,
    updateIngredients,
    available
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
        recipe.ingredients.forEach(i => {
            
        });
        recipe.ingredients.forEach(function(i, idx){
            if (req.body[i]) return;
            recipe.ingredients.splice(idx, 1);
        })
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
        console.log(recipe)
        if (err) console.log(err) //console.log(req.body.addIngredient);
        if (!recipe.user.equals(req.user._id)){
            
            return res.redirect("/");
            
        }
        recipe.ingredients.forEach(function(i){
            if (i === req.body.addIngredient) req.body.addIngredient = null;
        })
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

async function available(req, res, next) {
    try {
        console.log("I MADE IT TO THE CONTROLLER")
        let availableRec = [];
        storeIngArr = [];
        const userIngredients = await Ingredient.find( {users:{$elemMatch:{userId : req.user._id}}})
        if(!userIngredients) throw new Error("uhoh");
        console.log("I FOUND ALL THE INGREDIENTS", userIngredients);
        const recipes = await Recipe.find({});
        console.log("I FOUND ALL THE RECIPES", recipes);
        let ingredientsNames = [];
        userIngredients.forEach(function(i){   //create array of strings for comparison 
            ingredientsNames.push(i.name);
        })
        console.log("I MADE AN ARRAY OF INGREDIENTS NAMES", ingredientsNames);
        recipes.forEach(function(r, idx){
            r.forEach(function(i){
                storeIngArr[idx].push(i);
            })
        })
        console.log("I MADE A LIST OF ingredients arrays", storeIngArr)
        recipes.forEach(function(r, idx){
            const containsAll = ingredientsNames.every(element => {
                return r.ingredients.includes(element);
            })
            if (containsAll) availableRec.push(r);
        });
        if (availableRec.length > 0) {
            console.log("I AM DOING THE IF THING");
            res.render('recipes/showAvailable', {availableRec});
        } else {
            console.log("I AM DOING THE ELSE THING");
            res.redirect('/recipes');
        }
    } catch (err) {
      return next(err); 
    }
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
