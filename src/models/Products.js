import {Schema, model, models, Types} from 'mongoose';

const ProductSchema = new Schema({
    title: {type: String, required: true},
    description: String,
    price: {type: Number, required: true},
    category: {type: Types.ObjectId, ref:'Category'},
    properties: {type: Object},
    images: {type: [String]},
});

export const Product = models.Products || model('Products', ProductSchema)