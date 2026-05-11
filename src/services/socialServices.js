import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export const linkGoogle = async (accessToken) => {
    const res = await axios.post(
        `${API}/api/socials/link-google`,
        { token: accessToken },
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }
    );

    return res.data;
};

export const startXAuth = async () => {
    const res = await axios.get(
        `${API}/api/socials/x/start`,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }
    );

    return res.data;
};

export const unlinkX = async () => {
    const res = await axios.post(
        `${API}/api/socials/unlink-x`,
        {},
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }
    );

    return res.data;
};