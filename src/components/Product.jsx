import React from 'react';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import './Product.scss';

function Product({ shopId, productId, imageUrl, productName, productManufacturer, productType, productPrice, deleteProduct}) {
    return (
        <div className='product'>

            <h2 className='product__heading'>{productName}</h2>
            <img src={imageUrl} alt={productName} className="product__img" />
            <div className='product__group'>
                <h3>Price :</h3>
                <h3>₹{productPrice}</h3>
            </div>

            <div className='product__group'>
                <h3>Manufacturer :</h3>
                <h3>{productManufacturer}</h3>
            </div>

            <div className="product__group">
                <h3>{productType}</h3>
            </div>

            <div className="product__group">
                <HighlightOffIcon fontSize='large' className='product-delete-icon' onClick={() => deleteProduct(productId)} />
            </div>
        </div>
    );
}

export default Product;
