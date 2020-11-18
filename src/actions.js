import axios from "./axios";

export async function getList() {
    try {
        const { data } = await axios.get("/api/getFriends");
        // console.log("data from axios: ", data);
        // console.log("axios myRequests: ", data.myRequests);
        // console.log("axios friendsWannabes: ", data.friendsWannabes);
        return {
            type: "GET_LIST",
            myRequests: data.myRequests,
            friendsWannabes: data.friendsWannabes,
        };
    } catch (err) {
        console.log("error in axios GET /api/getFriends ", err);
    }
}

export async function unfriend(id) {
    try {
        //
        let { data } = await axios.post(`/api/setFriendship/${id}`);
        console.log("unfriended!");
        if (data.success) {
            return {
                type: "UNFRIENDED",
                id: id,
            };
        }
    } catch (err) {
        console.log("error in axios /api/setFriendship ", err);
    }
}

export async function accept(id) {
    try {
        //
        let { data } = await axios.post(`/api/setFriendship/${id}`);
        console.log("accepted!");
        if (data.success) {
            return {
                type: "ACCEPTED",
                id: id,
            };
        }
    } catch (err) {
        console.log("error in axios /api/setFriendship ", err);
    }
}

export async function reject(id) {
    let body = { action: "reject" };
    try {
        //
        let { data } = await axios.post(`/api/setFriendship/${id}`, body);
        console.log("rejected!");
        if (data.success) {
            return {
                type: "REJECTED",
                id: id,
            };
        }
    } catch (err) {
        console.log("error in axios /api/setFriendship ", err);
    }
}

export async function cancel(id) {
    try {
        //
        let { data } = await axios.post(`/api/setFriendship/${id}`);
        console.log("cancelled!");
        if (data.success) {
            return {
                type: "CANCELLED",
                id: id,
            };
        }
    } catch (err) {
        console.log("error in axios /api/setFriendship ", err);
    }
}

///////////////////// MESSAGE BOARD /////////////////////

export function mbdbHistory(msgs) {
    // console.log("action: bringing up the list!");
    return {
        type: "RETRIEVED_MSGS",
        msgsHistory: msgs,
    };
}

export function mbdbNewEntry(msg) {
    // console.log("action: adding a new message!");
    return {
        type: "NEW_MSG",
        newestMessage: msg,
    };
}
