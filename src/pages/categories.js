import { useEffect, useState } from 'react';
import Layout from '../Components/Layout';
import axios from 'axios';
export default function Categories() {
    const [categoryName, setCategoryName] = useState('');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        getCategories();
    }, []);

    function getCategories() {
        axios.get('/api/categories').then(response => {
            setCategories(response.data)
        });
    }

    async function saveCategory(ev) {
        ev.preventDefault();
        await axios.post('/api/categories', { categoryName });
        setCategoryName('');
        getCategories();
    }

    return (
        <Layout>
            <form onSubmit={saveCategory}>
                <h1>Categories</h1>
                <label>New category name</label>
                <div className='flex gap-1'>
                    <input type='text'
                        value={categoryName}
                        placeholder='Category name'
                        className='mb-0' 
                        onChange={ev => setCategoryName(ev.target.value)} />
                    <select
                        className='mb-0' >
                        <option value="">No Parent Category</option>
                    </select>
                    <button type='submit' className='btn-primary'>Save</button>
                </div>
            </form>
            <table className='basic mt-2'>
                <thead>
                    <tr>
                        <td>Category</td>
                    </tr>
                </thead>
                <tbody>
                    {categories.length && categories.map((category, i) => (
                        <tr key={i}>
                            <td>{category.name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    )
}