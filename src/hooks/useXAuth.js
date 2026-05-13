import toast from "react-hot-toast";

const useXAuth = ({
    user,
    setUser,
    startXAuth,
    unlinkX,
}) => {

    const handleXLink = async () => {
        try {
            const res = await startXAuth();

            window.open(
                res.url,
                "_blank",
                "width=500,height=600"
            );

        } catch (err) {
            console.error(err);

            toast.error("Failed to link X");
        }
    };

    const handleXUnlink = async () => {
        try {
            const res = await unlinkX();

            setUser(res.user);

            toast.success("X unlinked");

        } catch (err) {
            console.error(err);

            toast.error("Failed to unlink");
        }
    };

    return {
        handleXLink,
        handleXUnlink,
    };
};

export default useXAuth;