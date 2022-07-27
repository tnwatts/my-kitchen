const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userIngredientSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    qty: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

const ingredientsSchema = new Schema({
  name: String,
  quantityType: String,
  users: {
    type: [userIngredientSchema],
    default: [],
  },
});

module.exports = mongoose.model("Ingredient", ingredientsSchema);
