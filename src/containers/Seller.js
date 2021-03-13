/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useConsumer } from '../context/AppContext';
import {firestore} from '../firebase/firebase';
import db from '../db/db';
import Header from './Header';
import Profile from '../components/Profile';
import SidePanel from '../components/SidePanel';
import Modal from '../components/Modal';
import ShopCard from '../components/ShopCard';
import Spinner from './toolbar/Spinner';
import Alert from './toolbar/Alert';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import '../scss/global.scss';

function Seller() {

    const { store, dispatch } = useConsumer();
    const history = useHistory();
    const modalRef = useRef(null);
    const [profile, setProfile] = useState(false);
    const [sidePanel, setSidePanel] = useState(false);
    const [displayShops, setDisplayShops] = useState([]);
    const [modal, setModal] = useState(false);
    const [spinner, setSpinner] = useState(false);


    useEffect(() => {
        const unsubscribe = firestore.collection('users').doc(store.auth.userPhoneNumber).collection('seller')
        .onSnapshot((querySnapshot) => {
            let shops = [];
            querySnapshot.forEach((doc) => {
                shops.push(doc.data());
            });
            dispatch({ type: 'SET_SHOPS', payload: shops });
            setDisplayShops(shops);
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

    }, [modal]);


    const searchHandler = (e) => {
        let search = e.target.value.trim().toLowerCase();

        if (search === '') {
            setDisplayShops(store.shops);
        } else {
            let shops = store.shops.filter((shop) => (shop.shopName.trim().toLowerCase().includes(search)));
            setDisplayShops(shops);
        }
    };

    const profileHandler = (e) => {
        setSidePanel(false);
        setProfile(profile => !profile);
    };

    const settingHandler = (e) => {
        setProfile(false);
        setSidePanel(sidePanel => !sidePanel);
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

    const submitHandler = async (e) => {
        e.preventDefault();
        setModal(false);
        setSpinner(true);
        const shopName = e.target['shopName'].value.toLowerCase();
        const shopEmail = e.target['shopEmail'].value.toLowerCase();
        const shopPhoneNumber = e.target['shopPhoneNumber'].value;
        const shopLandmark = e.target['shopLandmark'].value.toLowerCase();
        const shopCity = e.target['shopCity'].value.toLowerCase();
        const shopState = e.target['shopState'].value.toLowerCase();

        let res = await db.setShop(store.auth.userPhoneNumber, { shopName, shopEmail, shopPhoneNumber, shopLandmark, shopCity, shopState });

        if (res) {
            dispatch({ type: 'SET_ALERT', payload: { open: true, message: 'Shop created', severity: 'success' } });
        } else {
            dispatch({ type: 'SET_ALERT', payload: { open: true, message: 'Something went wrong', severity: 'error' } });
        }
        setSpinner(false);
    };

    const toggleHandler = async (e, shopId) => {
        if (e.target.name === 'shopOpen') {
            await db.updateShop(store.auth.userPhoneNumber, shopId, { shopOpen: e.target.checked });
        } else if (e.target.name === 'shopDeliver') {
            await db.updateShop(store.auth.userPhoneNumber, shopId, { shopDeliver: e.target.checked });
        }
    };

    const deleteShopHandler = async (shopId) => {
        setSpinner(true);
        let res = await db.deleteShop(store.auth.userPhoneNumber, shopId);
        if (res) {
            dispatch({ type: 'SET_ALERT', payload: { open: true, message: 'Shop deleted', severity: 'success' } });
        } else {
            dispatch({ type: 'SET_ALERT', payload: { open: true, message: 'Something went wrong', severity: 'error' } });
        }
        setSpinner(false);
    };


    const modalArr = [
        { type: 'text', name: 'shopName', inputClass: 'form__input', placeholder: 'Shop Name', required: true, label: 'Shop Name', labelClass: 'form__label' },
        { type: 'email', name: 'shopEmail', inputClass: 'form__input', placeholder: 'Shop Email', required: true, label: 'Shop Email', labelClass: 'form__label' },
        { type: 'text', name: 'shopPhoneNumber', inputClass: 'form__input', placeholder: 'Shop Phone Number', required: true, label: 'Shop Phone Number', labelClass: 'form__label' },
        { type: 'text', name: 'shopLandmark', inputClass: 'form__input', placeholder: 'Shop Landmark', label: 'Shop Landmark', labelClass: 'form__label' },
        { type: 'text', name: 'shopCity', inputClass: 'form__input', placeholder: 'Shop City', label: 'Shop City', labelClass: 'form__label' },
        { type: 'text', name: 'shopState', inputClass: 'form__input', placeholder: 'Shop State', label: 'Shop State', labelClass: 'form__label' },
        { type: 'submit', name: 'ShopCreate', inputClass: 'btn btn--primary', value: 'Create' }
    ];


    return (
        <>
            {spinner && <Spinner />}
            <Header searchHandler={searchHandler} profileHandler={profileHandler} settingHandler={settingHandler} />
            {profile && <Profile />}
            {sidePanel && <SidePanel switchHandler={switchHandler} />}
            <div className='cards'>
                {(displayShops.length > 0) ? displayShops.map((ele, i) => (<ShopCard {...ele} deleteShopHandler={deleteShopHandler} toggleHandler={toggleHandler} key={i} />))
                    : <h3 className='cards-empty'>There is no shop yet.</h3>}
            </div>
            {modal && <Modal title='Create Shop' modalArr={modalArr} ref={modalRef} submitHandler={submitHandler} />}
            <AddCircleIcon className='add-icon' onClick={() => setModal(true)} />
            {store.alert.open && <Alert />}
        </>
    );
}

export default Seller;
