const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ingredientsSchema = new Schema({
  name: String,
  quantityType: String,
  quantity: Number,
  usersId: [{type: Schema.Types.ObjectId, ref: 'User'}],

});


module.exports = mongoose.model('Ingredient', ingredientsSchema);
