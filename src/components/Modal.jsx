import React, { forwardRef } from 'react';
import Input from './Input';
import './Modal.scss';

const Modal = forwardRef(
    function ({ title, modalArr, submitHandler }, ref) {
        return (
            <div className='overlay' id='overlay' ref={ref}>
                <div className='modal'>
                    <span className='modal__close'>&#10006;</span>
                    <div className='modal__heading'>
                        <h2 className='modal__heading-main u-margin-bottom-small'>
                            {title}
                        </h2>

                        <form className='form' onSubmit={submitHandler}>
                            {modalArr.map((ele, i) => {
                                return (<div className='form__group' key={i}>
                                    <Input
                                        type={ele.type}
                                        name={ele.name}
                                        inputClass={ele.inputClass}
                                        id={ele.id}
                                        placeholder={ele.placeholder}
                                        required={ele.required}
                                        minLength={ele.maxLength}
                                        maxLength={ele.minLength}
                                        label={ele.label}
                                        labelClass={ele.labelClass}
                                    />
                                </div>);
                            })}
                        </form>
                    </div>
                </div>
            </div>
        );
    }
);

export default Modal;
