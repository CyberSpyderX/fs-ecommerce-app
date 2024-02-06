import mongoose from "mongoose";
import clientPromise from '../../../lib/mongodb';
import { Product } from "../../models/Products";
import { mongooseConnect } from "../../../lib/mongoose";
import { isAdminRequest } from "../api/auth/[...nextauth]";

export default async function handler(req, res) {
    const { method } = req;
    await mongooseConnect();
    await isAdminRequest(req, res);

    if(method === "GET") {
        if(req.query?.id) {
            return res.json(await Product.findOne({ _id: req.query.id }))
        }
        return res.json(await Product.find());
    }

    if(method === 'POST') {
        let { title, description, price, images, category, properties } = req.body;
        console.log({ title, description, price, images, category, properties });
        const productDoc = await Product.create({ title, description, price, images, category, properties  })
        res.json(productDoc);
    }

    if(method === 'PUT') {
        let { title, description, price, images, category, properties, _id } = req.body;
        console.log({ title, description, price, images, category, properties, _id });
        await Product.updateOne({ _id }, { title, description, price, images, category, properties  });
        res.json(true);
    }

    if(method === 'DELETE') {
        if(req.query?.id) {
            await Product.deleteOne({_id : req.query.id});
            res.json(true)
        }
    }
}