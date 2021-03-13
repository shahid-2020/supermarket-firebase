import React from 'react';
import { PulseLoader } from 'react-spinners';
import '../../scss/_variables.scss';
import '../../scss/global.scss';

function Spinner() {
    return (<div className='overlay' id='overlay'>
        <PulseLoader color='white' size={35} loading />
    </div>);
}

export default Spinner;
