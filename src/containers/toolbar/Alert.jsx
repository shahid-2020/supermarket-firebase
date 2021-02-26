import React, { useState, useEffect } from 'react';
import './Alert.scss';

function Alert({ message, messageType }) {
    const [display, setDisplay] = useState(false);

    useEffect(() => { 
        message?setDisplay(true):setDisplay(false)
    },[message])
    
    return (
        display && <p className={`alert alert-${messageType}`}>
             <span className='alert__message'>{message}</span>
             <span className='alert__close' onClick ={() => setDisplay(false)} >&#10006;</span>
             </p>
    )
}

export default Alert;
