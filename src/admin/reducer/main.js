import {
    COLLAPSED,
    SET_BIZ_ID,
    SET_AUTH_RESOURCE,
    SET_BIZ_DATA
} from './../utils/constant';

const initState = {
    collapsed: false,
    selectedBizId: '',
    authResources: [],
    bizList: [],
};

function demo(state = initState, action) {
    switch (action.type) {
            case COLLAPSED:
                return Object.assign({}, state, {
                    collapsed: action.value
                });
            case SET_BIZ_ID:
                return Object.assign({}, state, {
                    selectedBizId: action.value
                });
            case SET_AUTH_RESOURCE:
                return Object.assign({}, state, {
                    authResources: action.value
                });
            case SET_BIZ_DATA:
                return Object.assign({}, state, {
                    bizList: action.value
                });
            default:
                return state;
    }
}

export default demo;