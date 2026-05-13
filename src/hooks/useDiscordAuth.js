import toast from "react-hot-toast";

const useDiscordAuth = ({
    user,
    setUser,
    unlinkDiscord,
}) => {

    const handleDiscordLink = () => {
        try {
            const token = localStorage.getItem("token");

            window.open(
                `${import.meta.env.VITE_API_URL}/api/socials/discord?token=${token}`,
                "_blank",
                "width=500,height=700"
            );

        } catch (err) {
            console.error(err);

            toast.error("Failed to link Discord");
        }
    };

    const handleDiscordUnlink = async () => {
        try {
            const res = await unlinkDiscord();

            setUser(res.user);

            toast.success("Discord unlinked");

        } catch (err) {
            console.error(err);

            toast.error("Failed to unlink Discord");
        }
    };

    return {
        handleDiscordLink,
        handleDiscordUnlink,
    };
};

export default useDiscordAuth;