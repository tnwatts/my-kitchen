const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recipeSchema = new Schema({
    name: String,
    diet: String,
    preparationTime: String,
    directions: String,
    ingredients: [{type: Schema.Types.ObjectId, ref: 'Ingredient'}],
}, {
    timestamps: true
});


module.exports = mongoose.model('Recipe', recipeSchema);
