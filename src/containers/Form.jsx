import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import firebase from '../firebase/firebase';
import db from '../db/db';
import { useConsumer } from '../context/AppContext';
import Input from '../components/Input';
import '../scss/global.scss';
import '../scss/_utils.scss';
function Form() {

    const { dispatch } = useConsumer();
    const history = useHistory();

    const [auth, setAuth] = useState(null);

    useEffect(() => {
        if (!auth) {
            let currentUser = firebase.auth().currentUser;
            if (!currentUser) {
                history.goBack();
                return;
            }
            setAuth({ ...auth, userPhoneNumber: currentUser.phoneNumber, userId: currentUser.uid });
        }
    }, [history, auth]);

    useEffect(() => {

        if (auth && auth.userPhoneNumber && auth.userId && auth.userName && auth.userEmail && auth.userType) {
            dispatch({ type: 'SET_AUTH', payload: auth });
            db.setUser(auth)
                .then(res => (res && history.push(`/${auth.userType}`)));
        }

    }, [auth, dispatch, history]);
    const submitHandler = (e) => {
        e.preventDefault();
        const userName = e.target['name'].value;
        const userEmail = e.target['email'].value;
        const userType = e.target['type'].value;
        setAuth({ ...auth, userName, userEmail, userType });

    };

    return (
        <>
            <div className='heading'>
                <h2 className='heading__main u-margin-bottom-small'>
                    Hi, there..
                </h2>
                <h3 className='heading__sub u-margin-bottom-small'>
                    Let us know about you
                </h3>
                <form className='form' onSubmit={submitHandler}>
                    <div className='form__group'>
                        <Input
                            type='text'
                            name='name'
                            inputClass='form__input'
                            id='name'
                            placeholder='Name'
                            required
                            label='Name'
                            labelClass='form__label' />
                    </div>

                    <div className='form__group'>
                        <Input
                            type='email'
                            name='email'
                            inputClass='form__input'
                            id='email'
                            placeholder='Email'
                            required
                            label='Email'
                            labelClass='form__label' />
                    </div>

                    <div className='form__group u-display-inline-block'>
                        <Input
                            type='radio'
                            name='type'
                            inputClass='form__input-radio'
                            id='buyer'
                            required
                            value='buyer'
                            label='Buyer'
                            labelClass='form__label-radio' />
                    </div>

                    <div className='form__group u-display-inline-block'>
                        <Input
                            type='radio'
                            name='type'
                            inputClass='form__input-radio'
                            id='seller'
                            required
                            value='seller'
                            label='Seller'
                            labelClass='form__label-radio' />
                    </div>

                    <Input
                        type='submit'
                        inputClass='btn btn--primary u-display-block'
                        value='Save' />
                </form>
            </div>
        </>
    );
}

export default Form;
