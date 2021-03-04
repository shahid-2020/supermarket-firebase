import { firestore } from '../firebase/firebase';
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

}
export default new Database(firestore);