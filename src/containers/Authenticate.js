import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useConsumer } from '../context/AppContext';
import firebase from '../firebase/firebase';
import db from '../db/db';
import PhoneNumber from '../components/PhoneNumber';
import Verification from './Verification';
import { isMobilePhone } from 'validator';
import Alert from './toolbar/Alert';
import Spinner from './toolbar/Spinner';
import './Authenticate.scss';

function Authenticate() {

    const { store, dispatch } = useConsumer();
    const history = useHistory();

    const [obj, setObj] = useState({ phoneNumber: '', smsStatus: null });
    const [spinner, setSpinner] = useState(null);

    const setRecaptchaVerifier = () => {
        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('requestOtp', {
            'size': 'invisible',
            'callback': (response) => { }
        });
    };

    useEffect(() => {
        setRecaptchaVerifier();
    }, []);

    const resetRecaptchaVerifier = () => {
        window.recaptchaVerifier.render().then(function (widgetId) {
            window.grecaptcha.reset(widgetId);
        });
        setRecaptchaVerifier();
    };

    const requestOTP = async (e) => {
        e.preventDefault();
        setSpinner(true);
        const phoneNumber = `+91${e.target['phoneNumber'].value}`;

        if (!isMobilePhone(phoneNumber)) {

            dispatch({ type: 'SET_ALERT', payload: { open: true, message: 'Invalid phone number', severity: 'error' } });

            setSpinner(false);
            return;
        }

        try {
            window.confirmationResult = await firebase.auth().signInWithPhoneNumber(phoneNumber, window.recaptchaVerifier);
            resetRecaptchaVerifier();
            setObj({ ...obj, phoneNumber, smsStatus: true });

            dispatch({ type: 'SET_ALERT', payload: { open: true, message: 'SMS sent successfully', severity: 'success' } });

        } catch (error) {
            resetRecaptchaVerifier();

            dispatch({ type: 'SET_ALERT', payload: { open: true, message: 'Something went wrong', severity: 'error' } });

        } finally {
            setSpinner(false);
        }


    };

    const verifyOTP = async (e, code) => {
        e.preventDefault();
        setSpinner(true);
        try {
            const result = await window.confirmationResult.confirm(code);
            if (!result) {
                dispatch({ type: 'SET_ALERT', payload: { open: true, message: 'Invalid OTP', severity: 'error' } });
                return;
            }
            const user = await db.getUser(obj.phoneNumber);

            if (user) {
                dispatch({ type: 'SET_AUTH', payload: user });
                history.push(`/seller`);
                return;
            }

            history.push(`/form`);
        } catch (error) {
            setSpinner(false);
            dispatch({ type: 'SET_ALERT', payload: { open: true, message: 'Something went wrong', severity: 'error' } });
        }
    };

    const toggleSmsStatus = () => {
        setObj({ ...obj, smsStatus: !obj.smsStatus });
    };


    return (
        <>
            {spinner && <Spinner />}
            {obj.smsStatus ?
                (<div className='sidebar'>
                    <Verification phoneNumber={obj.phoneNumber} resendHandler={toggleSmsStatus} submitHandler={verifyOTP} />
                </div>)
                :
                (<div className='sidebar'>
                    <PhoneNumber btnId='requestOtp' submitHandler={requestOTP} />
                </div>)}
            {store.alert.open && <Alert />}
        </>
    );
}

export default Authenticate;
