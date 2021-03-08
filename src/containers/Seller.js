import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useConsumer } from '../context/AppContext';
import db from '../db/db';
import Header from './Header';
import Modal from '../components/Modal';
import ShopCard from '../components/ShopCard';
import Spinner from './toolbar/Spinner';
import CustomizedSnackbar from './toolbar/CustomizedSnackbar';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import '../scss/_layout.scss';

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

    const { store, dispatch } = useConsumer();
    const history = useHistory();
    const modalRef = useRef(null);
    const [displayShops, setDisplayShops] = useState([]);
    const [modal, setModal] = useState(false);
    const [spinner, setSpinner] = useState(false);

    const fetchShops = () => {
        if (!store.auth.userPhoneNumber) {
            return;
        }
        setSpinner(true);
        db.getShops(store.auth.userPhoneNumber)
            .then((shops) => {
                dispatch({ type: 'SET_SHOPS', payload: shops });
                setDisplayShops(shops);
                setSpinner(false);
            });
    };

    useEffect(() => {

        if (!store.auth.userPhoneNumber) {
            history.push('/');
            return;
        }

        if (modal) {
            modalRef.current.onclick = modalHandler;
        }

        // let latestShopsArr = [];
        // const unsubscribe = firestore.collection('users').doc(store.auth.userPhoneNumber).collection('seller')
        //     .onSnapshot((querySnapshot) => {
        //         querySnapshot.forEach((doc) => {
        //             latestShopsArr.push(doc.data());
        //         });
        //         dispatch({ type: 'SET_SHOPS', payload: latestShopsArr });
        //         setDisplayShops(latestShopsArr);
        //         latestShopsArr = [];

        //         if (spinner) {
        //             setSpinner(false);
        //         }
        //     }, (error) => {
        //         if (spinner) {
        //             setSpinner(false);
        //         }
        //     });

        // return () => unsubscribe();


    }, [history, store, modal]);

    useEffect(() => {
        setSpinner(true);
        fetchShops();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const searchHandler = (e) => {
        let search = e.target.value.trim().toLowerCase();

        if (search === '') {
            setDisplayShops(store.shops);
        } else {
            let shops = store.shops.filter((shop) => (shop.shopName.trim().toLowerCase().includes(search)));
            setDisplayShops(shops);
        }
    };

    const modalHandler = (e) => {
        if (e.target.className === 'overlay' || e.target.className === 'modal__close') {
            setModal(false);
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        const shopName = e.target['shopName'].value;
        const shopEmail = e.target['shopEmail'].value;
        const shopPhoneNumber = e.target['shopPhoneNumber'].value;
        const shopLandmark = e.target['shopLandmark'].value;
        const shopCity = e.target['shopCity'].value;
        const shopState = e.target['shopState'].value;

        let res = await db.setShop(store.auth.userPhoneNumber, { shopName, shopEmail, shopPhoneNumber, shopLandmark, shopCity, shopState });

        if (res) {
            dispatch({ type: 'SET_ALERT', payload: { open: true, message: 'Shop created', severity: 'success' } });
            fetchShops();
        } else {
            dispatch({ type: 'SET_ALERT', payload: { open: true, message: 'Something went wrong', severity: 'error' } });
        }

        setModal(false);
    };

    const switchHandler = async (e, shopId) => {
        console.log(e.target.checked);
        if (e.target.name === 'shopOpen') {
            await db.updateShop(store.auth.userPhoneNumber, shopId, { shopOpen: e.target.checked });
        } else if (e.target.name === 'shopDeliver') {
            await db.updateShop(store.auth.userPhoneNumber, shopId, { shopDeliver: e.target.checked });

        }
    };

    const deleteHandler = async (shopId) => {
        let res = await db.deleteShop(store.auth.userPhoneNumber, shopId);

        if (res) {
            fetchShops();
            dispatch({ type: 'SET_ALERT', payload: { open: true, message: 'Shop deleted', severity: 'error' } });
        } else {
            dispatch({ type: 'SET_ALERT', payload: { open: true, message: 'Something went wrong', severity: 'error' } });
        }
    };


    return (
        <>
            {spinner && <Spinner />}
            <Header searchHandler={searchHandler} />
            <div className='cards'>
                {(displayShops.length > 0) ? displayShops.map((ele, i) => (<ShopCard {...ele} switchHandler={switchHandler} deleteShop={deleteHandler} key={i} />))
                    : <h3 className='cards-empty'>There is no shop yet.</h3>}
            </div>
            {modal && <Modal title='Create Shop' modalArr={modalArr} ref={modalRef} submitHandler={submitHandler} />}
            <AddCircleIcon className='add-icon' onClick={() => setModal(true)} />
            {store.alert.open && <CustomizedSnackbar message={store.alert.message} severity={store.alert.severity} />}
        </>
    );
}

export default Seller;
