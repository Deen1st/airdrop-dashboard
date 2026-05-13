import axios from "axios";

const API = import.meta.env.VITE_API_URL;

const authHeaders = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
});

/* GOOGLE */

export const linkGoogle = async (accessToken) => {
    const res = await axios.post(
        `${API}/api/socials/link-google`,
        { token: accessToken },
        authHeaders()
    );

    return res.data;
};

export const unlinkGoogle = async () => {
    const res = await axios.post(
        `${API}/api/socials/unlink-google`,
        {},
        authHeaders()
    );

    return res.data;
};

/* X */

export const startXAuth = async () => {
    const res = await axios.get(
        `${API}/api/socials/x/start`,
        authHeaders()
    );

    return res.data;
};

export const unlinkX = async () => {
    const res = await axios.post(
        `${API}/api/socials/unlink-x`,
        {},
        authHeaders()
    );

    return res.data;
};

/* DISCORD */

export const unlinkDiscord = async () => {
    const res = await axios.post(
        `${API}/api/socials/unlink-discord`,
        {},
        authHeaders()
    );

    return res.data;
};

/* TELEGRAM */

export const linkTelegram = async (telegramUser) => {
    const res = await axios.post(
        `${API}/api/socials/link-telegram`,
        telegramUser,
        authHeaders()
    );

    return res.data;
};

export const unlinkTelegram = async () => {
    const res = await axios.put(
        `${API}/api/socials/unlink-telegram`,
        {},
        authHeaders()
    );

    return res.data;
};