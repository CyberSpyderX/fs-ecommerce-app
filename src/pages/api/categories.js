import { Category } from "../../models/Category";
import mongoose from "mongoose";
import { mongooseConnect } from "../../../lib/mongoose";
import { isAdminRequest } from "../api/auth/[...nextauth]";

export default async function handler(req, res) {
    const { method } = req;
    await mongooseConnect();
    await isAdminRequest(req, res);

    if(method === 'GET') {
        const categories = await Category.find().populate('parent');
        res.json(categories);
    }

    if(method === 'POST') {
        let { categoryName, categoryParent, properties } = req.body;

        if(!categoryParent) {
            categoryParent = null;
        }
        
        const categoryDoc = await Category.create({ name: categoryName, parent: categoryParent, properties});
        res.json(categoryDoc);
    }

    if(method === 'PUT') {
        let { categoryName, categoryParent, properties, _id } = req.body;
        
        if(!categoryParent) {
            categoryParent = null;
        }

        const categoryDoc = await Category.findOneAndUpdate({ _id }, { name: categoryName, parent: categoryParent, properties });
        res.json(categoryDoc);
    }

    if(method === 'DELETE') {
        const { id } = req.query;
        console.log("Deleting ID: ",req.query );
        await Category.deleteOne({_id: id});
        res.json('ok');
    }
}