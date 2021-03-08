import React from 'react';
import { useHistory } from 'react-router-dom';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import SearchIcon from '@material-ui/icons/Search';
import SettingsIcon from '@material-ui/icons/Settings';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import './Header.scss';

function Header({ back, searchHandler, cartHandler, settingHandler }) {
    const history = useHistory();
    return (
        <header className='header'>
            <div className='header__start'>
                {back && <ArrowBackIosIcon fontSize='large' style={{ color: 'white', cursor: 'pointer' }} onClick={() => history.goBack()} />}
                <h1 className='header__logo'>
                    Supermarket
                </h1>
            </div>

            <div className='header__search'>
                <input
                    type='text'
                    id='header__search-input'
                    className='header__search-input'
                    placeholder='Search for shop, products and more..'
                    onChange={searchHandler} />

                <label htmlFor='header__search-input' className='header__search-label'>
                    <SearchIcon fontSize='large' style={{ cursor: 'pointer' }} />
                </label>
            </div>

            <div className='header__icons'>
                <AccountCircleIcon fontSize='large' style={{ color: 'white', cursor: 'pointer' }} />
                {cartHandler &&
                    <ShoppingCartIcon fontSize='large' style={{ color: 'white', cursor: 'pointer' }} onClick={cartHandler} />}

                {settingHandler && <SettingsIcon fontSize='large' style={{ color: 'white', cursor: 'pointer' }} onClick={settingHandler} />}
            </div>

        </header>
    );
}

export default Header;
