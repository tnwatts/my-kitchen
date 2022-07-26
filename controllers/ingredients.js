const Ingredient = require('../models/ingredient');


module.exports = {
    index,
    create,

}

function index(req, res) {
    Ingredient.find({  })
    res.render('ingredients/index', );
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