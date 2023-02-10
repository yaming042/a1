import {
    TEST
} from './../utils/reduxConstant';

const initState = {
    collapsed: false,
    selectedBizId: '',
    authResources: [],
    bizList: [],
};

function demo(state = initState, action) {
    switch (action.type) {
            case TEST:
                return Object.assign({}, state, {
                    collapsed: action.value
                });
            default:
                return state;
    }
}

export default demo;