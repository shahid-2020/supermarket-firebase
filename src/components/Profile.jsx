import React from 'react';
import {Link , useHistory} from 'react-router-dom';
import firebase from 'firebase';
import {useConsumer} from '../context/AppContext';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import CallIcon from '@material-ui/icons/Call';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import HomeIcon from '@material-ui/icons/Home';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import './Profile.scss';
function Profile() {

    const history = useHistory();
    const { store, dispatch } = useConsumer();

    const signOut = () => {
        firebase.auth().signOut();
        dispatch({type:'RESET_STORE'});
        history.push('/');
    };


    const iconStyle = {
        color: '#fff',
        fontSize: 25
    }
    return (
        <div className='profile'>
            
            <div className="profile__group">
                <PermIdentityIcon style={iconStyle}/>
                <p className="profile__group-content">{store.auth.userName}</p>
            </div>

            <div className="profile__group">
                <CallIcon style={iconStyle}/>
                <p className="profile__group-content">{store.auth.userPhoneNumber}</p>
            </div>

            <div className="profile__group">
                <MailOutlineIcon style={iconStyle}/>
                <p className="profile__group-content">{store.auth.userEmail}</p>
            </div>

            <div className="profile__group">
                <HomeIcon style={iconStyle}/>
                <Link to='/page-under-construction' className="profile__group-content">Address</Link>
            </div>

            <div className="profile__group">
                <NotificationsNoneIcon style={iconStyle}/>
                <Link to='/page-under-construction' className="profile__group-content">Notification</Link>
            </div>

            <div className="profile__group">
                <LocalOfferIcon style={iconStyle}/>
                <Link to='/page-under-construction' className="profile__group-content">Offer</Link>
            </div>

            <div className="profile__group">
                <HelpOutlineIcon style={iconStyle}/>
                <Link to='/page-under-construction' className="profile__group-content">Help</Link>
            </div>

            <div className="profile__group">
                <ExitToAppIcon style={iconStyle}/>
                <Link to='#' className="profile__group-content" onClick= {signOut}>Sign out</Link>
            </div>

        </div>
    )
}

export default Profile;
