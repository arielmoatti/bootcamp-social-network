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

export async function acceptFriend(id) {
    try {
        //
        let { data } = await axios.post(`/api/setFriendship/${id}`);
        console.log("accepted!", data);
        if (data.success) {
            return {
                type: "FRIEND_ACCEPTED",
                id: id,
            };
        }
    } catch (err) {
        console.log("error in ************** ", err);
    }
}
