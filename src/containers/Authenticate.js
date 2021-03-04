import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import firebase from '../firebase/firebase';
import db from '../db/db';
import { useConsumer } from '../context/AppContext';
import PhoneNumber from '../components/PhoneNumber';
import Verification from './Verification';
import { isMobilePhone } from 'validator';
import Alert from './toolbar/Alert';
import Spinner from './toolbar/Spinner';

function Authenticate() {

    const { dispatch } = useConsumer();
    const history = useHistory();

    const [obj, setObj] = useState({
        phoneNumber: '',
        smsStatus: null,
        alert: { message: '', alertType: '' }
    });
    const [spinner, setSpinner] = useState(null);

    useEffect(() => {
        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('requestOtp', {
            'size': 'invisible',
            'callback': (response) => { }
        });
    }, []);

    const resetRecaptchaVerifier = () => {
        window.recaptchaVerifier.render().then(function (widgetId) {
            window.grecaptcha.reset(widgetId);
        });
    };

    const requestOTP = async (e) => {
        e.preventDefault();
        setSpinner(true);
        const phoneNumber = `+91${e.target['phoneNumber'].value}`;

        if (!isMobilePhone(phoneNumber)) {
            setObj({ ...obj, alert: { ...obj.alert, message: 'Invalid phone number', alertType: 'error' } });
            setSpinner(false);
            return;
        }

        try {
            window.confirmationResult = await firebase.auth().signInWithPhoneNumber(phoneNumber, window.recaptchaVerifier);
            resetRecaptchaVerifier();
            setObj({
                ...obj, phoneNumber, smsStatus: true,
                alert: { ...obj.alert, message: 'OTP sent successfully', alertType: 'success' }
            });

        } catch (error) {
            resetRecaptchaVerifier();
            setObj({ ...obj, alert: { ...obj.alert, message: 'Something went wrong', alertType: 'error' } });

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
                setObj({ ...obj, alert: { ...obj.alert, message: 'Invalid OTP', alertType: 'error' } });
                return;
            }
            const user = await db.getUser(obj.phoneNumber);

            if (user) {
                dispatch({ type: 'SET_AUTH', payload: user });
                history.push('/seller');
                return;
            }

            history.push(`/form`);
        } catch (error) {
            setObj({ ...obj, alert: { ...obj.alert, message: error, alertType: 'error' } });
            setSpinner(false);
        }
    };

    const toggleSmsStatus = () => setObj({ ...obj, smsStatus: !obj.smsStatus, alert: { ...obj.alert, message: '', alertType: '' } });


    return (
        <>
            {spinner && <Spinner />}
            {obj.smsStatus ?
                (<>
                    <Alert message={obj.alert.message} alertType={obj.alert.alertType} />
                    <Verification phoneNumber={obj.phoneNumber} resendHandler={toggleSmsStatus} submitHandler={verifyOTP} />
                </>)
                :
                (<>

                    <Alert message={obj.alert.message} alertType={obj.alert.alertType} />
                    <PhoneNumber btnId='requestOtp' submitHandler={requestOTP} />
                </>)}
        </>
    );
}

export default Authenticate;
