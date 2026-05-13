import toast from "react-hot-toast";

const useTelegramActions = ({
    setUser,
    unlinkTelegram,
}) => {

    const handleTelegramUnlink = async () => {
        try {
            await unlinkTelegram();

            setUser((prev) => ({
                ...prev,
                telegramId: null,
                telegramUsername: null,
                telegramAvatar: null,
            }));

            toast.success("Telegram unlinked");

        } catch (err) {
            console.error(err);

            toast.error("Failed to unlink Telegram");
        }
    };

    return {
        handleTelegramUnlink,
    };
};

export default useTelegramActions;