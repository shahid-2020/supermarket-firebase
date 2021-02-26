import React from 'react';

function Input({ type, name, inputClass, id, placeholder, required, value, minLength, maxLength, label, labelClass }) {
    return (
        <>
            <input type={type} name={name} id={id} className={inputClass} placeholder={placeholder} required={required} value={value} maxLength={maxLength} minLength={minLength}/>

            <label htmlFor={id} className={labelClass}>{label}</label>
        </>
    );
}

export default Input;
