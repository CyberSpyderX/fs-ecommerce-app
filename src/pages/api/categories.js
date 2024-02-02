import { Category } from "../../models/Category";

export default async function handler(req, res) {
    const { method } = req;

    if(method === 'GET') {
        const categories = await Category.find();
        res.json(categories);
    }
    if(method === 'POST') {
        const { categoryName } = req.body;

        const categoryDoc = await Category.create({ name: categoryName });
        res.json(categoryDoc);
    }

}