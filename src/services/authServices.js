import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export const getNonce = async (wallet) => {
    const res = await axios.post(
        `${API}/api/auth/nonce`,
        { wallet }
    );

    return res.data;
};

export const walletAuth = async (
    wallet,
    signature
) => {
    const res = await axios.post(
        `${API}/api/auth/auth`,
        {
            wallet,
            signature,
        }
    );

    return res.data;
};

export const googleAuth = async (credential) => {
    const res = await axios.post(
        `${API}/api/users/google`,
        { credential }
    );

    return res.data;
};