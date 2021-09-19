
const initState = {
    token: ""
}

export const authReducer = (state=initState, action)=> {

    if(action.type === "SAVE_TOKEN"){

        return {
            ...state,
            token: action.token
        }

    }
    return state;
}