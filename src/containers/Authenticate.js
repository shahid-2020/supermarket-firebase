import React, { useState, useEffect, useContext } from 'react';
import { context } from '../context/AppContext';
import firebase from '../firebase/firebase';
import PhoneNumber from '../components/PhoneNumber';
import Verification from './Verification';
import Alert from './toolbar/Alert';
import Spinner from './toolbar/Spinner';

function Authenticate() {

    const [obj, setObj] = useState({
        phoneNumber: '',
        smsStatus: null,
        msgStatus: { message: '', messageType: '' }
    });

    const [spinner, setSpinner] = useState(null);


    useEffect(() => {
        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('requestOtp', {
            'size': 'invisible',
            'callback': (response) => { }
        });
    }, []);

    const { dispatch } = useContext(context);

    const resetRecaptchaVerifier = () => {
        window.recaptchaVerifier.render().then(function (widgetId) {
            window.grecaptcha.reset(widgetId);
        });
    };

    const requestOTP = (e) => {
        e.preventDefault();
        setSpinner(true);
        const phoneNumber = `+91${e.target['phoneNumber'].value}`;
        
        if(isNaN(phoneNumber)){
            setObj({
                ...obj,
                msgStatus: { ...obj.msgStatus, message: 'Invalid phone number', messageType: 'error' }
            });
            setSpinner(false);
            return;
        }

        const appVerifier = window.recaptchaVerifier;
        firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
            .then((confirmationResult) => {
                window.confirmationResult = confirmationResult;
                resetRecaptchaVerifier();
                setObj({
                    ...obj, phoneNumber, smsStatus: true,
                    msgStatus: { ...obj.msgStatus, message: 'OTP sent successfully', messageType: 'success' }
                });
                setSpinner(false);
            }).catch((error) => {
                resetRecaptchaVerifier();
                setObj({ ...obj, msgStatus: { ...obj.msgStatus, message: 'Something went wrong', messageType: 'error' } });
                setSpinner(false);
            });
        ;

    };

    const verifyOTP = (e, code) => {
        e.preventDefault();
        setSpinner(true);
        if (code) {
            window.confirmationResult.confirm(code).then((result) => {
                setSpinner(false);
                dispatch({ type: 'SET_AUTH_PHONE_NUMBER', payload: result.user.phoneNumber });
            }).catch((error) => {
                setObj({ ...obj, msgStatus: { ...obj.msgStatus, message: 'Something went wrong', messageType: 'error' } });
                setSpinner(false);
            });
        }

    };

    const toggleSmsStatus = () => setObj({ ...obj, smsStatus: !obj.smsStatus, msgStatus: { ...obj.msgStatus, message: '', messageType: '' } });


    return (
        <>
            {spinner && <Spinner />}
            {obj.smsStatus ?
                (<>
                    <Alert message={obj.msgStatus.message} messageType={obj.msgStatus.messageType} />
                    <Verification phoneNumber={obj.phoneNumber} resendHandler={toggleSmsStatus} submitHandler={verifyOTP} />
                </>)
                :
                (<>

                    <Alert message={obj.msgStatus.message} messageType={obj.msgStatus.messageType} />
                    <PhoneNumber btnId='requestOtp' submitHandler={requestOTP} />
                </>)}
        </>
    );
}

export default Authenticate;
