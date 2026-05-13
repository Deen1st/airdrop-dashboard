import { useEffect } from "react";
import toast from "react-hot-toast";

const useSocialAuthListener = (fetchMe, setUser) => {
    useEffect(() => {
        const listener = async (event) => {
            if (event.data?.success) {
                try {
                    const user = await fetchMe();

                    setUser(user);

                    toast.success("Social account linked!");

                } catch (err) {
                    console.log("Failed to refresh user");
                }
            }
        };

        window.addEventListener("message", listener);

        return () => {
            window.removeEventListener("message", listener);
        };
    }, [fetchMe, setUser]);
};

export default useSocialAuthListener;