import { useRouter } from "next/router";
import Layout from "../../../Components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import ProductForm from "../../../Components/ProductForm";

export default function EditProductPage() {
    const [product, setProduct] = useState(null);
    const router = useRouter();
    const { id } = router.query
    
    useEffect(() => {
        if(!id) {
            return;
        }
        
        axios.get('/api/products?id=' + id).then(response => {
            setProduct(response.data)
        });
    }, [id]);
    
    return (
        <Layout>
            <h1>Edit Product</h1>
            {product && <ProductForm {...product}/>}
        </Layout>
    );
}