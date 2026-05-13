import toast from "react-hot-toast";

const useGoogleAuth = ({
  user,
  setUser,
  linkGoogle,
  unlinkGoogle,
}) => {

  const handleGoogleLink = async () => {
    if (user?.googleId) {
      toast("Google already linked");
      return;
    }

    try {
      if (!window.google) {
        toast.error("Google not loaded");
        return;
      }

      const tokenClient =
        window.google.accounts.oauth2.initTokenClient({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,

          scope: "openid email profile",

          prompt: "select_account",

          callback: async (response) => {
            try {
              const res = await linkGoogle(
                response.access_token
              );

              setUser(res.user);

              toast.success("Google linked!");

            } catch (err) {
              console.error(
                err.response?.data || err.message
              );

              toast.error("Google link failed");
            }
          },
        });

      tokenClient.requestAccessToken();

    } catch (err) {
      console.error(err);

      toast.error("Google auth failed");
    }
  };

  const handleGoogleUnlink = async () => {
    try {
      const res = await unlinkGoogle();

      setUser(res.user);

      toast.success("Google unlinked");

    } catch (err) {
      console.error(err);

      toast.error("Failed to unlink");
    }
  };

  return {
    handleGoogleLink,
    handleGoogleUnlink,
  };
};

export default useGoogleAuth;