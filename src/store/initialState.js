export const initialState = {
    auth: {
        userId: null,
        userName: null,
        userPhoneNumber: null,
        userEmail: null,
        userType: null
    },
    shops: [],
    products: [],
    alert: { open: false, message: null, severity: null }
};