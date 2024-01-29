import Link from 'next/link';
import Layout from '../Components/Layout';

export default function products() {
    return (
        <Layout>
            <Link className='bg-blue-900 text-white py-1 px-2 rounded-md' href={'/products/new'} >Add New Product</Link>
        </Layout>
    )
}