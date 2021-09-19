

const initState = {
    GP: {
        mpl:{}
    }
}

export const gpReducer = (state=initState, action)=> {

    if(action.type === "SAVE_GP"){
        return {
            ...state,
            GP: action.gp
        }
    }
    return state;
}