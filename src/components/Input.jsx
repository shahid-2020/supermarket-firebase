import React from 'react';

function Input({ type, name, inputClass, id, placeholder, required, value, minLength, maxLength, label, labelClass }) {
    return (
        <>
            <input type={type} name={name} id={id} className={inputClass} placeholder={placeholder} required={required} value={value} minLength={minLength} maxLength={maxLength}/>

            <label htmlFor={id} className={labelClass}>{label}</label>
        </>
    );
}

export default Input;
