

const initState = {
    items: null
}

export const menuReducer = (state=initState, action)=> {

    if(action.type === "SAVE_MENU_ITEMS"){

        return {
            ...state,
            items: action.items
        }

    }
    return state;
}