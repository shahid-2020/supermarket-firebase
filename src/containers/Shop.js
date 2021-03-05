import React, { useState, useEffect, useRef } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useConsumer } from '../context/AppContext';
import { firestore } from '../firebase/firebase';
import db from '../db/db';
import Header from './Header';
import Modal from '../components/Modal';
import ShopCard from '../components/ShopCard';
import Spinner from './toolbar/Spinner';
import CustomizedSnackbar from './toolbar/CustomizedSnackbar';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import '../scss/_layout.scss';

const modalArr = [
    { type: 'file', name: 'productImages', inputClass: 'form__input', placeholder: 'Product Images', label: 'Product Images', labelClass: 'form__label' },

    { type: 'text', name: 'productName', inputClass: 'form__input', placeholder: 'Product Name', required: true, label: 'Product Name', labelClass: 'form__label' },

    { type: 'text', name: 'productType', inputClass: 'form__input', placeholder: 'product Type', required: true, label: 'product Type', labelClass: 'form__label' },

    { type: 'text', name: 'productPrice', inputClass: 'form__input', placeholder: 'product Price', required:true, label: 'Product Price', labelClass: 'form__label' },

    { type: 'submit', name: 'addProduct', inputClass: 'btn btn--primary', value: 'Add' }
];

function Shop() {

    const { store, dispatch } = useConsumer();
    const history = useHistory();
    const {shopId} = useParams();
    const modalRef = useRef(null);
    const [displayProducts, setDisplayProducts] = useState([]);
    const [modal, setModal] = useState(false);
    const [spinner, setSpinner] = useState(false);
    const [csb, setCsb] = useState({ open: false, message: '', severity: '' });

    useEffect(() => {
        // setSpinner(true);
    }, []);

    useEffect(() => {

        // if (!store.auth.userPhoneNumber) {
        //     history.push('/');
        //     return;
        // }

        if (modal) {
            modalRef.current.onclick = modalHandler;
        }

    }, [history, modal, store]);

    const searchHandler = (e) => {
        let search = e.target.value.trim().toLowerCase();

        if (search === '') {
            setDisplayProducts(store.shops);
        } else {
            let shops = displayProducts.filter((product) => (product.productName.trim().toLowerCase().includes(search)));
            setDisplayProducts(shops);
        }
    };

    const modalHandler = (e) => {
        if (e.target.className === 'overlay' || e.target.className === 'modal__close') {
            setModal(false);
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();

    };


    return (
        <>
            {spinner && <Spinner />}
            <Header searchHandler={searchHandler} />
            {modal && <Modal title='Add Product' modalArr={modalArr} ref={modalRef} submitHandler={submitHandler} />}
            <AddCircleIcon className='add-icon' onClick={() => setModal(true)} />
            {csb.open && <CustomizedSnackbar message={csb.message} severity={csb.severity} />}
        </>
    );
}

export default Shop;
