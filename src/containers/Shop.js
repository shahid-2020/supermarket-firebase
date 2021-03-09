/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useConsumer } from '../context/AppContext';
import db from '../db/db';
import Header from './Header';
import Product from '../components/Product';
import Modal from '../components/Modal';
import Spinner from './toolbar/Spinner';
import Alert from './toolbar/Alert';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import '../scss/global.scss';
function Shop() {

    const { store, dispatch } = useConsumer();
    const history = useHistory();
    const { shopId } = useParams();
    const modalRef = useRef(null);
    const [file, setFile] = useState(null);
    const [displayProducts, setDisplayProducts] = useState([]);
    const [modal, setModal] = useState(false);
    const [spinner, setSpinner] = useState(false);

    const fetchProducts = () => {
        if (!store.auth.userPhoneNumber) {
            return;
        }
        setSpinner(true);
        db.getProducts(shopId)
            .then((products) => {
                dispatch({ type: 'SET_PRODUCTS', payload: products });
                setDisplayProducts(products);
                setSpinner(false);
            });
    };


    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {

        if (!store.auth.userPhoneNumber) {
            history.push('/');
            return;
        }

        if (modal) {
            modalRef.current.onclick = modalHandler;
        }

    }, [store, modal]);

    const searchHandler = (e) => {
        let search = e.target.value.trim().toLowerCase();

        if (search === '') {
            setDisplayProducts(store.products);
        } else {
            let shops = store.products.filter((product) => (product.productName.trim().toLowerCase().includes(search)));
            setDisplayProducts(shops);
        }
    };

    const modalHandler = (e) => {
        if (e.target.className === 'overlay' || e.target.className === 'modal__close') {
            setModal(false);
        }
    };

    const fileUploadHandler = (e) => {
        const selected = e.target.files[0];
        const types = ['image/jpeg', 'image/jpg', 'image/png'];
        if (selected && types.includes(selected.type)) {
            setFile(selected);
        } else {
            setFile(null);
            dispatch({ type: 'SET_ALERT', payload: { open: true, message: 'Invalid Image Type', severity: 'error' } });
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        if (!file) {
            dispatch({ type: 'SET_ALERT', payload: { open: true, message: 'Invalid Image', severity: 'error' } });
            return;
        }

        setModal(false);
        setSpinner(true);
        const productName = e.target['productName'].value;
        const productManufacturer = e.target['productManufacturer'].value;
        const productType = e.target['productType'].value;
        const productPrice = e.target['productPrice'].value;

        let res = await db.setProduct(file, { shopId, productName, productManufacturer, productType, productPrice });
        if (res) {
            fetchProducts();
            dispatch({ type: 'SET_ALERT', payload: { open: true, message: 'Product added successfully', severity: 'success' } });
        } else {
            dispatch({ type: 'SET_ALERT', payload: { open: true, message: 'Unable to add product', severity: 'error' } });
        }
        setSpinner(false);
    };

    const deleteProductHandler = async (productId) => {
        let res = await db.deleteProduct(productId);
        if (res) {
            fetchProducts();
            dispatch({ type: 'SET_ALERT', payload: { open: true, message: 'Shop deleted', severity: 'error' } });
        } else {
            dispatch({ type: 'SET_ALERT', payload: { open: true, message: 'Something went wrong', severity: 'error' } });
        }
    };



    const modalArr = [
        { type: 'file', name: 'productImages', inputClass: 'form__input', placeholder: 'Product Image', label: 'Product Image', labelClass: 'form__label', onChange: fileUploadHandler },

        { type: 'text', name: 'productName', inputClass: 'form__input', placeholder: 'Product Name', required: true, label: 'Product Name', labelClass: 'form__label' },

        { type: 'text', name: 'productManufacturer', inputClass: 'form__input', placeholder: 'Product Manufacturer', required: true, label: 'Product Manufacturer', labelClass: 'form__label' },

        { type: 'text', name: 'productType', inputClass: 'form__input', placeholder: 'Product Type', required: true, label: 'Product Type', labelClass: 'form__label' },

        { type: 'text', name: 'productPrice', inputClass: 'form__input', placeholder: 'Product Price', required: true, label: 'Product Price', labelClass: 'form__label' },

        { type: 'submit', name: 'addProduct', inputClass: 'btn btn--primary', value: 'Add' }
    ];


    return (
        <>
            {spinner && <Spinner />}
            <Header back searchHandler={searchHandler} />
            {modal && <Modal title='Add Product' modalArr={modalArr} ref={modalRef} submitHandler={submitHandler} />}
            <div className='cards'>
            {(displayProducts.length > 0) ? displayProducts.map((product, i) => (<Product {...product} deleteProductHandler={deleteProductHandler} key= {i}/>))
            : <h3 className='cards-empty'>There is no product yet.</h3>}
            </div>
            <AddCircleIcon className='add-icon' onClick={() => setModal(true)} />
            {store.alert.open && <Alert/>}
        </>
    );
}

export default Shop;
