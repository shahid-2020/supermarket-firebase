import React from 'react';
import { Link } from 'react-router-dom';
import Input from './Input';
import '../scss/global.scss';
import '../scss/_utils.scss';

function PhoneNumber({ btnId, submitHandler }) {
    return (
        <>
            <div className='heading'>
                <h2 className='heading__main u-margin-bottom-small'>
                    Enter your phone number for verification.
                </h2>
                <h3 className='heading__sub u-margin-bottom-small'>
                    A 6-digit OTP will be sent on SMS
                </h3>
                <form className='form' onSubmit={submitHandler}>
                    <div className='form__group'>
                        <Input
                            type='text'
                            name='phoneNumber'
                            inputClass='form__input'
                            id='phoneNumber'
                            placeholder='Phone Number'
                            required
                            minLength='10'
                            maxLength='10'
                            label='Phone Number'
                            labelClass='form__label' />
                    </div>

                    <Input
                        type='submit'
                        inputClass='btn btn--primary'
                        id={btnId}
                        value='Request otp' />

                    <div className='form__info'>
                        By continuing, you agree to Super Market's <Link to={'/page-under-construction'}>Terms of Use</Link> and <Link to={'/page-under-construction'}>Privacy Policy</Link>.
                </div>

                </form>
            </div>
        </>
    );
}

export default PhoneNumber;
