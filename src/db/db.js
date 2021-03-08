import { firestore, storage } from '../firebase/firebase';
import { v4 as uuid } from 'uuid';

class Database {
    constructor (firestore) {
        this.db = firestore;
    }

    async setUser(userData) {
        if (!userData) {
            throw new Error('Arguments missing to fetch data');
        }
        try {
            await this.db.collection('users').doc(userData.userPhoneNumber).set(userData);
            return true;
        } catch (error) {
            throw error;
        }
    }

    async getUser(userId) {
        if (!userId) {
            throw new Error('Arguments missing to fetch data');
        }
        try {
            const doc = await this.db.collection('users').doc(userId).get();
            if (doc.exists) {
                return doc.data();
            }
            return false;

        } catch (error) {
            throw error;
        }

    }

    async setShop(userId, shopData) {
        if (!userId && !shopData) {
            throw new Error('Arguments missing to fetch data');
        }
        try {
            shopData.shopId = uuid();
            shopData.shopDeliver = false;
            shopData.shopOpen = false;
            await this.db.collection('users').doc(userId).collection('seller').doc(shopData.shopId)
                .set(shopData);
            return true;
        } catch (error) {
            throw error;
        }
    }

    async getShops(userId) {
        if (!userId) {
            throw new Error('Arguments missing to fetch data');
        }

        try {
            const querySnapshot = await this.db.collection('users').doc(userId).collection('seller').get();
            const shops = [];
            querySnapshot.forEach((doc) => {
                shops.push(doc.data());
            });

            return shops;
        } catch (error) {
            throw error;
        }
    }

    async updateShop(userId, shopId, shopData) {
        if (!userId && !shopId && !shopData) {
            throw new Error('Arguments missing to fetch data');
        }
        try {
            await this.db.collection('users').doc(userId).collection('seller').doc(shopId)
                .update(shopData);
            return true;
        } catch (error) {
            throw error;
        }
    }

    async deleteShop(userId, shopId) {
        if (!userId && !shopId) {
            throw new Error('Arguments missing to fetch data');
        }
        try {
            await this.db.collection('users').doc(userId).collection('seller').doc(shopId)
                .delete();
            return true;
        } catch (error) {
            throw error;
        }
    }

    async setFile(path, file) {
        if (!path && !file) {
            throw new Error('Arguments missing to fetch data');
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
            throw new Error('Arguments missing to fetch data');
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
            throw new Error('Arguments missing to fetch data');
        }
        try {
            const querySnapshot = await this.db.collection('products').get();
            const products = [];
            querySnapshot.forEach((doc) => {
                if(doc.data().shopId === shopId){
                    products.push(doc.data());
                }
            });
            return products;
        } catch (error) {
            throw error;
        }
    }

    async deleteProduct(productId){
        if (!productId) {
            throw new Error('Arguments missing to fetch data');
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

}
export default new Database(firestore);