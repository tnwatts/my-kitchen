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
       console.log(req.body, " FIRST");
       for (let key in req.body) {
        if (req.body[key] === '') delete req.body[key];
      }
        recipe.ingredients.forEach(function(i, idx){
            console.log(req.body[i], "BEFORE CHECK");
            if (req.body[i]) return;
            
            console.log(recipe.ingredients.splice(idx, 1), "AFTER CHECK");
        })
        console.log(req.body);
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
        let availableRec = [];
        storeIngArr = [];
        const userIngredients = await Ingredient.find( {users:{$elemMatch:{userId : req.user._id}}})
        if(!userIngredients) throw new Error("uhoh");
        const recipes = await Recipe.find({});
        let ingredientsNames = [];
        userIngredients.forEach(function(i){   //create array of strings for comparison 
            ingredientsNames.push(i.name);
        })
        await recipes.forEach(function(r, idx){
            storeIngArr.push(r.ingredients);
        })
        // console.log("I MADE A LIST OF RECIPE ingredients arrays", storeIngArr)
        // console.log("I MADE A LIST OF USER ingredients arrays", ingredientsNames)
        await recipes.forEach(function(r, idx){
            const containsAll = r.ingredients.every(element => {
                // console.log(element);
                return ingredientsNames.includes(element);
            })
            if (containsAll) {
                availableRec.push(r);
            }

        });
        console.log(availableRec);
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

