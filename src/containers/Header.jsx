import React from 'react';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import SearchIcon from '@material-ui/icons/Search';
import SettingsIcon from '@material-ui/icons/Settings';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import './Header.scss';

function Header({ userType }) {
  
    return (
        <header className='header'>
            <h1 className='header__logo'>
                Supermarket
                </h1>
            <div className='header__search'>
                <input
                    type='text'
                    id='header__search-input'
                    className='header__search-input'
                    placeholder='Search for shop, products and more..' />

                <label htmlFor='header__search-input' className='header__search-label'>
                    <SearchIcon fontSize='large' style={{ cursor: 'pointer' }} />
                </label>
            </div>

            <div className='header__icons'>
            <AccountCircleIcon fontSize='large' style={{ color: 'white', cursor: 'pointer' }} />
                {(userType === 'buyer') && 
                <ShoppingCartIcon fontSize='large' style={{ color: 'white', cursor: 'pointer' }} />}
                <SettingsIcon fontSize='large' style={{ color: 'white', cursor: 'pointer' }} />
            </div>

        </header>
    );
}

export default Header;