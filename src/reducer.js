export default function (state = {}, action) {
    if (action.type == "GET_LIST") {
        state = Object.assign({}, state, {
            myRequests: action.myRequests,
            friendsWannabes: action.friendsWannabes,
        });
    }

    if (action.type == "FRIEND_ACCEPTED") {
        state = {
            ...state,
            friendsWannabes: state.friendsWannabes.map((friend) => {
                if (friend.id == action.id) {
                    return {
                        ...friend,
                        accepted: true,
                    };
                } else {
                    return friend;
                }
            }),
        };
    }

    return state;
}
