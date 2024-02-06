import { useEffect, useState } from 'react';
import Layout from '../Components/Layout';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function Categories() {
    const [categoryName, setCategoryName] = useState('');
    const [categoryParent, setCategoryParent] = useState(null);
    const [editedCategory, setEditedCategory] = useState(null);
    const [properties, setProperties] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        getCategories();
    }, []);

    async function getCategories() {
        await axios.get('/api/categories').then(response => {
            setCategories(response.data)
        });
    }
    function editCategory(category) {
        setEditedCategory(category);
        setCategoryName(category.name);
        setCategoryParent( category?.parent?._id || "");
        let newProperties = [...category.properties];
        newProperties = newProperties.map(property => {
            return { ...property, values: property.values.join(',') }
        })

        setProperties(newProperties);
    }
    
    function removeProperty(idx) {
        console.log(idx);
        setProperties(prev => {
            const newProperties = [...prev].filter((p, i) =>  i !== idx );
            return newProperties;
        });
    }
    useEffect(() => {
        console.log("Properties changed... ", properties);
    }, [properties]);

    async function saveCategory(ev) {
        ev.preventDefault();

        const data = { categoryName, categoryParent, properties: properties.map(p => ( { name: p.name, values: p.values.split(',') }))}
        console.log(data);
        if(editedCategory) {
            await axios.put('/api/categories', { ...data, _id: editedCategory._id });
        } else {
            await axios.post('/api/categories', data);
        }
        clearEditedCategory();
        getCategories();
    }

    function clearEditedCategory() {
        setCategoryName('');
        setCategoryParent('');
        setEditedCategory(null);
        setProperties([]);
    }

    function addProperty() {
        setProperties(prev => [...prev, { name: '', values: '' }]);
    }

    async function deleteCategory(category) {
        Swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete ${category.name}`,
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#d55',
            confirmButtonText: 'Yes, Delete!',
            reverseButtons: true,
        }).then( async result => {
            if (result.isConfirmed) {
                const { _id: id } = category;
                console.log('/api/categories?id='+id);
                await axios.delete('/api/categories?id='+id);
            }
            getCategories();
        })
    }
    function changeProperty(attribute, idx, value) {
        setProperties(prev => {
            const newProperties = [...prev];
            newProperties[idx][attribute] = value;
            return newProperties;
        });     
    }
    return (
        <Layout>
            <form onSubmit={saveCategory} className='mb-2'>
                <h1>Categories</h1>
                <label>{editedCategory ? "Edit category " + editedCategory.name  : "New category name"}</label>
                <div className='flex gap-1'>
                    <input type='text'
                        value={categoryName}
                        placeholder='Category name'
                        className='mb-0' 
                        onChange={ev => setCategoryName(ev.target.value)} />
                    <select
                        className='mb-0' 
                        value={categoryParent}
                        onChange={ev => setCategoryParent(ev.target.value)} >
                        <option value={""}>No Parent Category</option>
                        {
                            categories.length && categories.map(category => 
                                <option key={category._id} value={category._id}>{category.name}</option>)
                        }
                    </select>
                </div>
            <div className='mb-2'>
                <label className='block'>Properties</label>
                <button className='btn-default' type='button' onClick={addProperty}>Add New Property</button>
                <div className='flex flex-col mt-2 gap-1'>
                    {
                        properties.length > 0 && properties.map( (property, i) => (
                            <div key={i} className='flex w-full gap-1'>
                                <input
                                 type='text' 
                                 placeholder='Property Name'
                                 className='mb-0'
                                 value={properties[i]['name']}
                                 onChange={e => changeProperty('name', i, e.target.value)}></input>
                                 <input 
                                 type='text' 
                                 placeholder='Property Values (Comma separted)'
                                 className='mb-0'
                                 value={properties[i]['values']}
                                 onChange={e => changeProperty('values', i, e.target.value)}></input>
                                 <button 
                                  type='button'
                                  className='btn-default'
                                  onClick={() => removeProperty(i)}>Remove</button>
                            </div>
                        ))
                    }
                </div>
            </div>
            <div className='flex gap-1'>
                { editedCategory && <button type='button' className='btn-primary' onClick={clearEditedCategory} >Cancel</button> }
                <button type='submit' className='btn-primary'>Save</button>
            </div>
            </form>
            { !editedCategory && <table className='basic mt-3'>
                <thead>
                    <tr>
                        <td>Category</td>
                        <td>Parent Category</td>
                        <td>Actions</td>
                    </tr>
                </thead>
                <tbody>
                    {categories.length ? categories.map((category, i) => (
                        <tr key={i}>
                            <td>{category.name}</td>
                            <td>{category?.parent?.name}</td>
                            <td>
                                <div className='flex gap-1'>
                                    <button 
                                      type='button' 
                                      className='btn-primary'
                                      onClick={() => editCategory(category)}>Edit</button>
                                    <button 
                                      type='button' 
                                      className='btn-primary'
                                      onClick={() => deleteCategory(category)}>Delete</button>
                                </div>
                            </td>
                        </tr>
                    )) : null}
                </tbody>
            </table> }
            
        </Layout>
    )
}