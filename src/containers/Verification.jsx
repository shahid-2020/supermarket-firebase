import React, { useState } from 'react';
import './Verification.scss';

function Verification({ phoneNumber, resendHandler, submitHandler }) {

    const [otp, setOtp] = useState(new Array(6).fill(''));

    const handleChange = (e, index) => {
        if (isNaN(e.target.value)) {
            return false;
        }

        setOtp([...otp.map((d, i) => (index === i) ? e.target.value : d)]);

        if (e.target.nextSibling) {
            e.target.nextSibling.focus();
        }
    };

    return (
        <div className='sidebar'>
            <div className='heading'>
                <h2 className="heading__main u-margin-bottom-small">
                    Enter the code that was sent to
                </h2>
                <h3 className="heading__sub u-margin-bottom-small">
                    {phoneNumber}
                </h3>
                <form className='form' onSubmit={e => submitHandler(e, otp.join(''))}>
                    <div className="form__group">

                        {otp.map((_, index) => (
                            <input
                                type='text'
                                name={`input-box-${index}`}
                                className='form__input-box'
                                id={`input-box-${index}`}
                                placeholder='0'
                                required
                                maxLength='1'
                                key={index}
                                onChange={e => handleChange(e, index)}
                                onFocus={e => e.target.select()}
                            />
                        ))}

                    </div>

                    <div className='form__group'>
                        <button
                            type='button'
                            className='btn-text u-margin-bottom-medium'
                            onClick={resendHandler}>Resend?</button>
                    </div>

                    <input
                        type='submit'
                        className='btn btn--primary'
                        value='Verify OTP' />

                </form>
            </div>
        </div>
    );
}

export default Verification;
