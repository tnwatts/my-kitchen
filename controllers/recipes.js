const Recipe = require("../models/recipe");

module.exports = {
    index,
    new: newRecipe
}

function index(req, res) {    
    Recipe.find({}, function(err, recipes){
            res.render('recipes/index' , {recipes});
    })
}

function newRecipe(req, res) {
    res.render('recipes/edit');
}