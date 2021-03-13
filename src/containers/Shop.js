/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useConsumer } from '../context/AppContext';
import {firestore} from '../firebase/firebase';
import db from '../db/db';
import Header from './Header';
import Profile from '../components/Profile';
import SidePanel from '../components/SidePanel';
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
    const [profile, setProfile] = useState(false);
    const [sidePanel, setSidePanel] = useState(false);
    const [displayProducts, setDisplayProducts] = useState([]);
    const [file, setFile] = useState(null);
    const [modal, setModal] = useState(false);
    const [spinner, setSpinner] = useState(false);


    useEffect(() => {
        const unsubscribe = firestore.collection('products').where('shopId', '==', shopId)
            .onSnapshot((querySnapshot) => {
                let products = [];
                querySnapshot.forEach((doc) => {
                    products.push(doc.data());
                });
    
                dispatch({ type: 'SET_PRODUCTS', payload: products });
                setDisplayProducts(products);
            });

            return () => unsubscribe();
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

    const settingHandler = (e) => {
        setProfile(false);
        setSidePanel(sidePanel => !sidePanel);
    };

    const profileHandler = (e) => {
        setSidePanel(false);
        setProfile(profile => !profile);
    };

    const switchHandler = async (e) => {
        const userType = ((store.auth.userType === 'seller') ? 'buyer' : 'seller');
        await db.updateUser(store.auth.userPhoneNumber, { userType: userType });
        history.push(`/${userType}`);
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
        const productName = e.target['productName'].value.toLowerCase();
        const productManufacturer = e.target['productManufacturer'].value.toLowerCase();
        const productType = e.target['productType'].value.toLowerCase();
        let productPrice = e.target['productPrice'].value;
        productPrice = (parseInt(productPrice) > 0) ? productPrice: '0';
        let res = await db.setProduct(file, { shopId, productName, productManufacturer, productType, productPrice });
        if (res) {
        
            dispatch({ type: 'SET_ALERT', payload: { open: true, message: 'Product added successfully', severity: 'success' } });
        } else {
            dispatch({ type: 'SET_ALERT', payload: { open: true, message: 'Unable to add product', severity: 'error' } });
        }
        setSpinner(false);
    };

    const deleteProductHandler = async (productId) => {
        setSpinner(true);
        let res = await db.deleteProduct(productId);
        if (res) {
            dispatch({ type: 'SET_ALERT', payload: { open: true, message: 'Product deleted', severity: 'success' } });
        } else {
            dispatch({ type: 'SET_ALERT', payload: { open: true, message: 'Something went wrong', severity: 'error' } });
        }
        setSpinner(false);
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
            <Header back searchHandler={searchHandler} profileHandler={profileHandler} settingHandler={settingHandler} />
            {profile && <Profile />}
            {sidePanel && <SidePanel switchHandler={switchHandler} />}
            {modal && <Modal title='Add Product' modalArr={modalArr} ref={modalRef} submitHandler={submitHandler} />}
            <div className='cards'>
                {(displayProducts.length > 0) ? displayProducts.map((product, i) => (<Product {...product} deleteProductHandler={deleteProductHandler} key={i} />))
                    : <h3 className='cards-empty'>There is no product yet.</h3>}
            </div>
            <AddCircleIcon className='add-icon' onClick={() => setModal(true)} />
            {store.alert.open && <Alert />}
        </>
    );
}

export default Shop;
