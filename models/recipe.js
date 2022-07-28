const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const recipeSchema = new Schema({
    name: String,
    diet: String,
    preparationTime: String,
    directions: String,
    user:  { type: Schema.Types.ObjectId, ref: "User" },
    ingredients: [String],
}, {
    timestamps: true
});


module.exports = mongoose.model('Recipe', recipeSchema);