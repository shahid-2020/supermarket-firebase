/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { useConsumer } from '../../context/AppContext';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import './Alert.scss';

function Alert() {
    const { store, dispatch } = useConsumer();

    const close = () => {
        dispatch({ type: 'RESET_ALERT' });
    };

    useEffect(() => {

        const timer = setTimeout(() => {
            close();
        }, 6000);

        return () => timer;

    }, []);

    const iconStyle = {
        fontSize:20
    };

    return (
        <div className={`alert alert-${store.alert.severity}`}>
            <div className='alert__group'>
                <span className='alert__group-icon'>
                    {store.alert.severity === 'success' && <CheckCircleOutlineIcon style={iconStyle}/>}
                    {store.alert.severity === 'error' && <ErrorOutlineIcon style={iconStyle}/>}
                </span>
                <p className='alert__group-message'>{store.alert.message}</p>
                </div>
            <span className='alert__close' onClick={close} >&#10006;</span>
        </div>
    );
}

export default Alert;