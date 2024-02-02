import mongoose from "mongoose";
import clientPromise from '../../../lib/mongodb';
import { Product } from "../../models/Products";
import { mongooseConnect } from "../../../lib/mongoose";

export default async function handler(req, res) {
    const { method } = req;
    mongoose.Promise = mongooseConnect();

    if(method === "GET") {
        if(req.query?.id) {
            return res.json(await Product.findOne({ _id: req.query.id}))
        }
        return res.json(await Product.find());
    }

    if(method === 'POST') {
        let { title, description, price, images } = req.body;
        const productDoc = await Product.create({ title, description, price, images })
        res.json(productDoc);
    }

    if(method === 'PUT') {
        let { title, description, price, images, _id } = req.body;
        await Product.updateOne({ _id }, { title, description, price, images });
        res.json(true);
    }

    if(method === 'DELETE') {
        if(req.query?.id) {
            await Product.deleteOne({_id : req.query.id});
            res.json(true)
        }
    }
}