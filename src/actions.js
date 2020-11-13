import axios from "./axios";

export async function getList() {
    try {
        const { data } = await axios.get("/api/getFriends");
        console.log("axios sent to get friendsList");
        console.log("data from axios: ", data);
        return {
            type: "GET_LIST",
            members: data,
        };
    } catch (err) {
        console.log("error in axios GET /api/getFriends ", err);
    }
}
