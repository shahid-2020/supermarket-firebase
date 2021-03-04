import React from 'react';
import { Link } from 'react-router-dom';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import '../../scss/_layout.scss';
import './Error404_page.scss';

function Error404_page() {
    return (
        <div className='image-background error404_page'>
            <div className='error404_page__container'>
                <Link to='/'>
                    <ArrowBackIosIcon />
                </Link>

                <h4 className='error404_page__header'>Error 404</h4>
                <p className='error404_page__text'>This is not the web page you are looking for.</p>
            </div>
        </div>
    );
}

export default Error404_page;
