import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export const fetchMe = async () => {
    const res = await axios.get(
        `${API}/api/users/me`,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }
    );

    return res.data;
};