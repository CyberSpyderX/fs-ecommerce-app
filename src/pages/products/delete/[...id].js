import { useRouter } from "next/router";
import Layout from "../../../Components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";

export default function DeleteProductPage() {
    const [title, setTitle] = useState('');
    const router = useRouter();
    const { id } = router.query;

    function goBack() {
        router.push('/products');
    }

    useEffect(() => {
        if(!id) {
            return;
        }

        axios.get('/api/products?id='+id).then(response => {
            setTitle(response.data.title);
        });
    }, [id]);

    async function deleteProduct() {
        await axios.delete('/api/products?id='+id).then(() => {
            goBack();
        });
    }
    return (
        <Layout>
            <h1 className="text-center">
                Do you really want to delete product {title}?
            </h1>
            <div className="flex gap-2 justify-center mt-5">
                <button className="btn-red" onClick={deleteProduct}>Yes</button>
                <button className="btn-default" onClick={goBack}>No</button>
            </div>
        </Layout>
    )
}