import React from 'react';
import { useHistory } from 'react-router-dom';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import './Error404_page.scss';

function Error404_page() {
    const history = useHistory();
    return (
        <div className='error_page'>
            <ArrowBackIosIcon onClick={() => history.goBack()} style={{ margin: '2rem', fontSize: 20, cursor: 'pointer' }} />
        </div>
    );
}

export default Error404_page;
