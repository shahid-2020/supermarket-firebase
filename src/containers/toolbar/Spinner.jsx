import React from 'react';
import {PulseLoader} from 'react-spinners';
import './Spinner.scss';

function Spinner() {
    return (<div className='overlay'>
        <PulseLoader color='white' size='35' loading />
    </div>);
}

export default Spinner;
