import { useEffect } from "react";
import toast from "react-hot-toast";

const useTelegramAuth = ({
    user,
    setUser,
    linkTelegram,
}) => {
    useEffect(() => {
        window.onTelegramAuth = async (telegramUser) => {
            try {
                const res = await linkTelegram(telegramUser);

                setUser(res.user);

                toast.success("Telegram linked successfully");

            } catch (err) {
                console.log(err);

                toast.error("Telegram linking failed");
            }
        };

        return () => {
            window.onTelegramAuth = null;
        };
    }, [setUser, linkTelegram]);

    useEffect(() => {
        if (!user?.telegramId) {
            const container = document.getElementById(
                "telegram-login-widget"
            );

            if (!container) return;

            container.innerHTML = "";

            const script = document.createElement("script");

            script.src =
                "https://telegram.org/js/telegram-widget.js?22";

            script.async = true;

            script.setAttribute(
                "data-telegram-login",
                "souq_connect_bot"
            );

            script.setAttribute("data-size", "large");

            script.setAttribute(
                "data-userpic",
                "false"
            );

            script.setAttribute(
                "data-request-access",
                "write"
            );

            script.setAttribute(
                "data-onauth",
                "onTelegramAuth(user)"
            );

            container.appendChild(script);
        }
    }, [user?.telegramId]);
};

export default useTelegramAuth;