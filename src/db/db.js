import firebase,{ firestore, storage } from '../firebase/firebase';
import { v4 as uuid } from 'uuid';

class Database {
    constructor (firebase, firestore) {
        this.firebase = firebase;
        this.db = firestore;
    }

    async setUser(userData) {
        if (!userData) {
            throw new Error('Arguments missing to perform action');
        }
        try {
            await this.db.collection('users').doc(userData.userPhoneNumber).set(userData);
            return true;
        } catch (error) {
            throw error;
        }
    }

    async getUser(docId) {
        if (!docId) {
            throw new Error('Arguments missing to perform action');
        }
        try {
            const doc = await this.db.collection('users').doc(docId).get();
            if (doc.exists) {
                return doc.data();
            }
            return false;

        } catch (error) {
            throw error;
        }
    }

    async updateUser(docId, userData) {
        if (!docId && !userData) {
            throw new Error('Arguments missing to perform action');
        }
        try {
            await this.db.collection('users').doc(docId).update(userData);
            return true;
        } catch (error) {
            throw error;
        }
    }

    async setShop(docId, shopData) {
        if (!docId && !shopData) {
            throw new Error('Arguments missing to perform action');
        }
        try {
            shopData.shopId = uuid();
            shopData.shopDeliver = false;
            shopData.shopOpen = false;
            await this.db.collection('users').doc(docId).collection('seller').doc(shopData.shopId)
                .set(shopData);
            return true;
        } catch (error) {
            throw error;
        }
    }

    async getShops(docId) {
        if (!docId) {
            throw new Error('Arguments missing to perform action');
        }

        try {
            const querySnapshot = await this.db.collection('users').doc(docId).collection('seller').get();
            const shops = [];
            querySnapshot.forEach((doc) => {
                shops.push(doc.data());
            });

            return shops;
        } catch (error) {
            throw error;
        }
    }

    async updateShop(docId, shopId, shopData) {
        if (!docId && !shopId && !shopData) {
            throw new Error('Arguments missing to perform action');
        }
        try {
            await this.db.collection('users').doc(docId).collection('seller').doc(shopId)
                .update(shopData);
            return true;
        } catch (error) {
            throw error;
        }
    }

    async deleteShop(docId, shopId) {
        if (!docId && !shopId) {
            throw new Error('Arguments missing to perform action');
        }
        try {
            await this.db.collection('users').doc(docId).collection('seller').doc(shopId)
                .delete();
            return true;
        } catch (error) {
            throw error;
        }
    }

    async setFile(path, file) {
        if (!path && !file) {
            throw new Error('Arguments missing to perform action');
        }

        return new Promise((resolve, reject) => {
            try {
                const date = Date.now();
                const completePath = path + date + file.name;
                const storageRef = storage.ref();
                const upload = storageRef.child(completePath).put(file);
                upload.on('state_changed', (snap) => {
                    // let percentage = (snap.bytesTransferred / snap.totalBytes) * 100;
                }, (error) => {
                    reject(error);
                }, async () => {
                    let url = await upload.snapshot.ref.getDownloadURL();
                    resolve({url, completePath});
                });
            } catch (error) {
                reject(error);
            }
        });

    }

    async setProduct(file, productData) {
        if (!file && !productData) {
            throw new Error('Arguments missing to perform action');
        }
        try {
            const {url, completePath} = await this.setFile('products/', file);
            productData.imageUrl= url;
            productData.imagePath= completePath;
            productData.productId = uuid();
            await this.db.collection('products').doc(productData.productId).set(productData);
            return true;
        } catch (error) {
            throw error;
        }

    }

    async getProducts(shopId){
        if (!shopId) {
            throw new Error('Arguments missing to perform action');
        }
        try {
            const querySnapshot = await this.db.collection('products').where('shopId', '==', shopId).get();
            const products = [];
            querySnapshot.forEach((doc) => {
                    products.push(doc.data());
            });
            return products;
        } catch (error) {
            throw error;
        }
    }

    async deleteProduct(productId){
        if (!productId) {
            throw new Error('Arguments missing to perform action');
        }
        try {
            const product = await this.db.collection('products').doc(productId).get();
            const storageRef = storage.ref();
            const imagePath = storageRef.child(product.data().imagePath);
            await imagePath.delete();
            await this.db.collection('products').doc(productId).delete();
            return true;
        } catch (error) {
            throw error;
        }
    }

    async addToCart(docId, productId){
        if (!docId && !productId) {
            throw new Error('Arguments missing to perform action');
        }

        try {
            const cartRef = this.db.collection('users').doc(docId).collection('buyer').doc('cart');
            const cart = await cartRef.get();
            if(!cart.exists){
                cartRef.set({cartProduct:[productId]})
            }else{
                cartRef.update({
                    cartProduct: this.firebase.firestore.FieldValue.arrayUnion(productId)
                });
            }

            return true;

        } catch (error) {
            throw error;
        }
    }

}
export default new Database(firebase, firestore);