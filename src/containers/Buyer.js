/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useConsumer } from '../context/AppContext';
import {firestore} from '../firebase/firebase';
import db from '../db/db';
import Header from './Header';
import Profile from '../components/Profile';
import SidePanel from '../components/SidePanel';
import Product from '../components/Product';
import Alert from './toolbar/Alert';
import '../scss/global.scss';
function Buyer() {

    const { store, dispatch } = useConsumer();
    const history = useHistory();
    const [profile, setProfile] = useState(false);
    const [sidePanel, setSidePanel] = useState(false);
    const [displayProducts, setDisplayProducts] = useState([]);

    useEffect(() => {
        const unsubscribe = firestore.collection('products')
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

        // if (!store.auth.userPhoneNumber) {
        //     history.push('/');
        //     return;
        // }



    }, [store]);

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
        await db.updateUser(store.auth.userPhoneNumber, {userType:userType});
        history.push(`/${userType}`);
    };

    const addProductHandler = async (productId) => {
        let res = await db.addToCart(store.auth.userPhoneNumber,productId);
        if (res) {
            dispatch({ type: 'SET_ALERT', payload: { open: true, message: 'Added to cart', severity: 'success' } });
        } else {
            dispatch({ type: 'SET_ALERT', payload: { open: true, message: 'Something went wrong', severity: 'error' } });
        }
    };



    return (
        <>
            <Header searchHandler={searchHandler} profileHandler={profileHandler} settingHandler={settingHandler} />
            {profile && <Profile />}
            {sidePanel && <SidePanel switchHandler={switchHandler} />}
            <div className='cards'>
                {(displayProducts.length > 0) ? displayProducts.map((product, i) => (<Product {...product} addProductHandler={addProductHandler}  key={i} />))
                    : <h3 className='cards-empty'>There is no product yet.</h3>}
            </div>
            {store.alert.open && <Alert />}
        </>
    );
}

export default Buyer;
