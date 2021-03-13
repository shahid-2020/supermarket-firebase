import React from 'react';
import { useHistory } from 'react-router-dom';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import './Construction_page.scss';

function Construction_page() {

    const history = useHistory();

    return (<div className='construction'>
        <ArrowBackIosIcon onClick={() => history.goBack()} style={{ margin: '2rem', fontSize: 20, cursor: 'pointer' }} />
    </div>);
};

export default Construction_page;
