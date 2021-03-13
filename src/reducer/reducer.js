export default function reducer(state, action) {
    switch (action.type) {
        case 'RESET_STORE':
            return {
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

        case 'SET_AUTH':
            return {
                ...state,
                auth: {
                    ...state.auth,
                    userId: action.payload.userId,
                    userName: action.payload.userName,
                    userPhoneNumber: action.payload.userPhoneNumber,
                    userEmail: action.payload.userEmail,
                    userType: action.payload.userType
                }
            };

        case 'SET_SHOPS':
            return {
                ...state,
                shops: action.payload
            };

        case 'SET_PRODUCTS':
            return {
                ...state,
                products: action.payload
            };

        case 'SET_ALERT':
            return {
                ...state,
                alert: { ...action.payload }
            };

        case 'RESET_ALERT':
            return {
                ...state,
                alert: { open: false, message: null, severity: null }
            };

        default:
            throw new Error('Unexpected action');
    }
}
