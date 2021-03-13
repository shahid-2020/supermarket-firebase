import React from 'react';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import './Product.scss';


function Product({ shopId, productId, imageUrl, productName, productManufacturer, productType, productPrice, deleteProductHandler, addProductHandler }) {
    return (
        <div className='product'>

            <h2 className='product__heading'>{productName}</h2>
            <img src={imageUrl} alt={productName} className="product__img" />

            <div className='product__group'>
                <h3 className='card__group-main'>Manufacturer :</h3>
                <h3 className='card__group-sub'>{productManufacturer}</h3>
            </div>

            <div className='product__group'>
                <h3 className='card__group-main'>Price :</h3>
                <h3 className='card__group-sub'>₹{productPrice}</h3>
            </div>

            <div className='product__group'>
            <h3 className='card__group-main'>{productType}</h3>
            {deleteProductHandler && <HighlightOffIcon fontSize='large' className='product-delete-icon' onClick={() => deleteProductHandler(productId)} />}
            {addProductHandler && <AddShoppingCartIcon fontSize='large' className='product-cart-icon' onClick={() => addProductHandler(productId)} />}
            </div>

        </div>
    );
}

export default Product;
