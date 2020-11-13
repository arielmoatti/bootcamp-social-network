export default function (state = {}, action) {
    if (action.type == "GET_LIST") {
        state = Object.assign({}, state, {
            members: action.members,
        });
    }

    return state;
}
