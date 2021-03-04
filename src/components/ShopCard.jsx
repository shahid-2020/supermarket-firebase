import React from 'react';
import {Link, useLocation} from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import DeleteIcon from '@material-ui/icons/Delete';
import './ShopCard.scss';

const AntSwitch = withStyles((theme) => ({
  root: {
    width: 28,
    height: 16,
    padding: 0,
    display: 'flex',
  },
  switchBase: {
    padding: 2,
    color: theme.palette.grey[500],
    '&$checked': {
      transform: 'translateX(12px)',
      color: theme.palette.common.white,
      '& + $track': {
        opacity: 1,
        backgroundColor: theme.palette.primary.main,
        borderColor: theme.palette.primary.main,
      },
    },
  },
  thumb: {
    width: 12,
    height: 12,
    boxShadow: 'none',
  },
  track: {
    border: `1px solid ${theme.palette.grey[500]}`,
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor: theme.palette.common.white,
  },
  checked: {},
}))(Switch);


function ShopCard({ shopName, shopEmail, shopPhoneNumber, shopOpen, shopDeliver, shopId, handleSwitch, deleteShop }) {
    const location = useLocation();
    return (
        <div className='card'>

                <h2 className='card__heading'>{shopName}</h2>

            <div className='card__group'>
                <h3 className='card__group-main'>Email</h3>
                <p className='card__group-sub'>{shopEmail}</p>
            </div>

            <div className='card__group'>
                <h3 className='card__group-main'>Phone number</h3>
                <p className='card__group-sub'>{shopPhoneNumber}</p>
            </div>

            <div className='card__group'>
                <h3 className='card__group-main'>Open</h3>
                <AntSwitch checked={shopOpen} name='shopOpen' onChange={(e) => handleSwitch(e, shopId)}/>
            </div>

            <div className='card__group'>
                <h3 className='card__group-main'>Deliver</h3>
                <AntSwitch checked={shopDeliver}  name='shopDeliver' onChange={(e) => handleSwitch(e, shopId)}/>
            </div>

            <Link to={`${location.pathname}/${shopId}`}>
            Enter Shop
            </Link>

            <DeleteIcon fontSize='large' className='delete-icon' onClick={() => deleteShop(shopId)}/>
        </div>
    );
}

export default ShopCard;
