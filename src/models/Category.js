import mongoose, { Schema, model, models } from "mongoose";

const categorySchema = new Schema({
  name: { type: String, required: true },
  parent: { type: mongoose.Types.ObjectId, ref: 'Category'},
  properties: { type: [Object]},
});

export const Category = models?.Category || new model('Category', categorySchema);