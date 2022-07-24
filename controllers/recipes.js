module.exports = {
    index,
    new: newRecipe
}

function index(req, res) {
    res.render('recipes/index',);
}

function newRecipe(req, res) {
    res.render('recipes/new');
}