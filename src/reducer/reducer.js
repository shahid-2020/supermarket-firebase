export default function reducer(state, action) {
    switch (action.type) {
        case 'SET_AUTH_PHONE_NUMBER':
            return {...state, auth:{...state.auth, userPhoneNumber:action.payload}};
        default:
            throw new Error("Unexpected action");
    }
}
