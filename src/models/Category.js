import { Schema, model, models } from "mongoose";

const categorySchema = new Schema({
  name: { type: String, required: true },
});

export const Category = models?.Category || new model('Category', categorySchema);