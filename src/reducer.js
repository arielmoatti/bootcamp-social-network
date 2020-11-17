export default (state = {}, action) => {
    switch (action.type) {
        case "GET_LIST":
            state = Object.assign({}, state, {
                myRequests: action.myRequests,
                friendsWannabes: action.friendsWannabes,
            });

        case "UNFRIENDED":
        case "REJECTED":
            state = {
                ...state,
                friendsWannabes: state.friendsWannabes.filter((member) => {
                    if (member.id == action.id) {
                        return;
                    } else {
                        return member;
                    }
                }),
            };

        case "ACCEPTED":
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

        case "CANCELLED":
            state = {
                ...state,
                myRequests: state.myRequests.filter((pending) => {
                    if (pending.id == action.id) {
                        return;
                    } else {
                        return pending;
                    }
                }),
            };

        case "RETRIEVED_MSGS":
            state = Object.assign({}, state, {
                boardMessages: action.msgsHistory,
            });
    }
    return state;
};
