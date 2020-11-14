export default function (state = {}, action) {
    if (action.type == "GET_LIST") {
        state = Object.assign({}, state, {
            myRequests: action.myRequests,
            friendsWannabes: action.friendsWannabes,
        });
    }

    if (action.type == "UNFRIENDED") {
        state = {
            ...state,
            friendsWannabes: state.friendsWannabes.map((friend) => {
                if (friend.id == action.id) {
                    return {};
                } else {
                    return friend;
                }
            }),
        };
    }

    if (action.type == "ACCEPTED") {
        state = {
            ...state,
            friendsWannabes: state.friendsWannabes.map((wannabe) => {
                if (wannabe.id == action.id) {
                    return {
                        ...wannabe,
                        accepted: true,
                    };
                } else {
                    return wannabe;
                }
            }),
        };
    }

    if (action.type == "REJECTED") {
        state = {
            ...state,
            friendsWannabes: state.friendsWannabes.map((wannabe) => {
                if (wannabe.id == action.id) {
                    return {};
                } else {
                    return wannabe;
                }
            }),
        };
    }

    if (action.type == "CANCELLED") {
        state = {
            ...state,
            myRequests: state.myRequests.map((pending) => {
                if (pending.id == action.id) {
                    return {};
                } else {
                    return pending;
                }
            }),
        };
    }

    return state;
}
