import React, { useState, useEffect, useRef } from 'react';
import { useConsumer } from '../context/AppContext';
import { firestore } from '../firebase/firebase';
import db from '../db/db';
import Header from './Header';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Modal from '../components/Modal';
import CustomizedSnackbar from './toolbar/CustomizedSnackbar';
import ShopCard from '../components/ShopCard';
import Spinner from './toolbar/Spinner';
import './Seller.scss';

const modalArr = [
    { type: 'text', name: 'shopName', inputClass: 'form__input', placeholder: 'Shop Name', required: true, label: 'Shop Name', labelClass: 'form__label' },
    { type: 'email', name: 'shopEmail', inputClass: 'form__input', placeholder: 'Shop Email', required: true, label: 'Shop Email', labelClass: 'form__label' },
    { type: 'text', name: 'shopPhoneNumber', inputClass: 'form__input', placeholder: 'Shop Phone Number', required: true, label: 'Shop Phone Number', labelClass: 'form__label' },
    { type: 'text', name: 'shopLandmark', inputClass: 'form__input', placeholder: 'Shop Landmark', label: 'Shop Landmark', labelClass: 'form__label' },
    { type: 'text', name: 'shopCity', inputClass: 'form__input', placeholder: 'Shop City', label: 'Shop City', labelClass: 'form__label' },
    { type: 'text', name: 'shopState', inputClass: 'form__input', placeholder: 'Shop State', label: 'Shop State', labelClass: 'form__label' },
    { type: 'submit', name: 'ShopCreate', inputClass: 'btn btn--primary', value: 'Create' }
];

function Seller() {

    const modalRef = useRef(null);
    const [modal, setModal] = useState(false);
    const [spinner, setSpinner] = useState(false);
    const [csb, setCsb] = useState({ open: false, message: '', severity: '' });
    const { store, dispatch } = useConsumer();

    useEffect(() => {
        setSpinner(true);
    }, []);

    useEffect(() => {
        if (modal) {
            modalRef.current.onclick = modalHandler;
        }
        let shopsArr = [];
        const unsubscribe = firestore.collection('users').doc('+917782996069').collection('seller')
            .onSnapshot((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    shopsArr.push(doc.data());
                });
                dispatch({ type: 'SET_SHOPS', payload: shopsArr });
                shopsArr = [];
                if (spinner) {
                    setSpinner(false);
                }
            });

        return () => unsubscribe();

    }, [modal, dispatch, spinner]);

    const modalHandler = (e) => {
        if (e.target.className === 'overlay' || e.target.className === 'modal__close') {
            setModal(false);
        }
    };

    const handleSwitch = async (e, shopId) => {
        if (e.target.name === 'shopOpen') {
            await db.updateShop('+917782996069', shopId, { shopOpen: e.target.checked });
        } else if (e.target.name === 'shopDeliver') {
            await db.updateShop('+917782996069', shopId, { shopDeliver: e.target.checked });
        }
    };

    const deleteShop = async (shopId) => {
        await db.deleteShop('+917782996069', shopId);
        setCsb({ open: true, message: 'Shop deleted', severity: 'error' });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        const shopName = e.target['shopName'].value;
        const shopEmail = e.target['shopEmail'].value;
        const shopPhoneNumber = e.target['shopPhoneNumber'].value;
        const shopLandmark = e.target['shopLandmark'].value;
        const shopCity = e.target['shopCity'].value;
        const shopState = e.target['shopState'].value;

        await db.setShop('+917782996069', { shopName, shopEmail, shopPhoneNumber, shopLandmark, shopCity, shopState });
        setCsb({ open: true, message: 'Shop created', severity: 'success' });
        setModal(false);
    };


    return (
        <>
            <Header />
            {spinner && <Spinner />}
            <div className='cards'>
                {(store.shops.length > 0) ? store.shops.map((ele, i) => (<ShopCard {...ele} handleSwitch={handleSwitch} deleteShop={deleteShop} key={i} />))
                    : <h3 className='cards-empty'>There is no shop yet.</h3>}
            </div>
            {modal && <Modal title='Create Shop' modalArr={modalArr} ref={modalRef} submitHandler={submitHandler} />}
            <AddCircleIcon className='add-icon' onClick={() => setModal(true)} />
            {csb.open && <CustomizedSnackbar message={csb.message} severity={csb.severity} />}
        </>
    );
}

export default Seller;
