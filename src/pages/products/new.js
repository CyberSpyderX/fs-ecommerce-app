import Layout from "../../Components/Layout";

export default function NewProduct() {
    return (
        <Layout>
            <input type="text" placeholder="Product Name"></input>
            <textarea placeholder="Description"></textarea>
        </Layout>
    );
}