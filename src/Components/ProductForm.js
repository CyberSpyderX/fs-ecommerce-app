import { useRouter } from 'next/router';
import { useState } from 'react';
import axios from 'axios';
import { PuffLoader } from 'react-spinners';
import { ReactSortable } from 'react-sortablejs';

export default function ProductForm({
    _id,
    title: existingTitle,
    images: existingImages,
    description: existingDescription,
    price: existingPrice
}) {
    console.log('Render... ', existingTitle);
    const [title, setTitle] = useState(existingTitle || '');
    const [description, setDescription] = useState(existingDescription || '');
    const [price, setPrice] = useState(existingPrice || '');
    const [images, setImages] = useState(existingImages || []);
    const [isUploading, setIsUploading] = useState(false);
    const [goToProducts, setGoToProducts] = useState(false);
    const router = useRouter();

    async function saveProduct(ev) {
        ev.preventDefault();
        const data = { title, description, price, images};

        if(_id) {
            await axios.put('/api/products', {...data, _id});
        } else {
            await axios.post('/api/products', data);
        }
        setGoToProducts(true);
    }

    if(goToProducts) {
        router.push('/products');
    }

    function updateImages(images) {
        setImages(images);
    }
    async function uploadImages(ev) {
        setIsUploading(true);

        const files = ev.target?.files;
        console.log(files);
        if(files?.length > 0) {
            const data = new FormData();
            for(const file of files) {
                data.append('file', file);
            }

            const res = await axios.post('/api/upload', data);
            console.log(res);
            setImages(oldImages => [...oldImages, ...res.data.links]);
        }
        setIsUploading(false);
    }
    return (
        <form onSubmit={saveProduct}>
            <label>Product Name</label>
            <input type="text" placeholder="Product Name" 
            value={title} onChange={ev => setTitle(ev.target.value)}></input>
            <label>Photos</label>
            {console.log('Images: ', images, !!images?.length)}
            
            <div className='mb-2 flex gap-1 flex-wrap'>
                <ReactSortable className='flex gap-1'
                 list={images} setList={updateImages}>
                {!!images?.length && images.map(link => (
                    <div key={link} className='h-24'>
                        <img src={link} alt="" className='rounded-lg' />
                    </div>
                ))}
                </ReactSortable>
                {
                    isUploading && (
                        <div className='h-24 flex items-center'>
                            <PuffLoader />
                        </div>
                    )
                }
                <label className='flex cursor-pointer bg-gray-200 rounded-lg w-24 h-24 text-gray-500 justify-center items-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                    </svg>
                    <div>
                        Upload
                    </div>
                    <input type='file' className='hidden' onChange={uploadImages}/>
                </label>
                {!images?.length && (
                    <div>No photos for this product</div>
                )}
            </div>
            <label>Description</label>
            <textarea 
                placeholder="Description"
                value={description} 
                onChange={ev => setDescription(ev.target.value)}></textarea>
            <label>Price (in CAD)</label>
            <input type="number" placeholder="Price" 
            value={price} onChange={ev => setPrice(ev.target.value)}></input>
            <button className="btn-primary">Save</button>
        </form>
    );
}