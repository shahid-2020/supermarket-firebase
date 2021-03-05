export default function reducer(state, action) {
    switch (action.type) {
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
        default:
            throw new Error('Unexpected action');
    }
}
