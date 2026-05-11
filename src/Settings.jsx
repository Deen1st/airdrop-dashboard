import { useUser } from "./context/UserContext";
import axios from "axios";
import toast from "react-hot-toast";
import { useEffect } from "react";
import Avatar from "./components/Avatar";
import { linkGoogle } from "./services/socialServices";
import {
  startXAuth,
  unlinkX,
} from "./services/socialServices";
import { fetchMe } from "./services/userServices";

const maskEmail = (email) => {
  if (!email) return "";

  const [name, domain] = email.split("@");

  if (!name || !domain) return email;

  const visible = name.slice(0, 2); // first 2 chars
  const masked = "*".repeat(Math.max(name.length - 2, 2));

  return `${visible}${masked}@${domain}`;
};

const Settings = () => {
  const { user, setUser } = useUser();

  const handleGoogleLink = async () => {
    if (user?.googleId) {
      toast("Google already linked");
      return;
    }

    try {
      console.log("CLICK WORKING");

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

              console.log("GOOGLE RESPONSE:", res);

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
      console.error(err); setUser(res.data.user);

      toast.error("Google auth failed");
    }
  };
  const handleGoogleUnlink = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/socials/unlink-google",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setUser(res.data.user);

      toast.success("Google unlinked");

    } catch (err) {
      console.error(err);

      toast.error("Failed to unlink");
    }
  };

  const handleXLink = async () => {
    try {
      const res = await startXAuth();

      const popup = window.open(res.url, "_blank", "width=500,height=600");

      window.addEventListener("message", (event) => {
        if (event.data?.success) {
          toast.success("X linked!");
          window.location.reload(); // quick refresh
        }
      });

    } catch (err) {
      toast.error("Failed to link X");
    }
  };

  const handleXUnlink = async () => {
    try {
      const res = await unlinkX();

      setUser(res.user || res);
      toast.success("X unlinked");

    } catch (err) {
      toast.error("Failed to unlink");
    }
  };

  const handleDiscordLink = () => {
    const token = localStorage.getItem("token");

    window.open(
      `http://localhost:5000/api/socials/discord?token=${token}`,
      "_blank",
      "width=500,height=700"
    );
  };

  const handleDiscordUnlink = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/socials/unlink-discord",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );


      setUser(res.data.user);
      toast.success("Discord unlinked");

    } catch (err) {
      toast.error("Failed to unlink Discord");
    }
  };

  useEffect(() => {
    window.onTelegramAuth = async (telegramUser) => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.post(
          "http://localhost:5000/api/socials/link-telegram",
          telegramUser,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUser(res.data.user);

        toast.success("Telegram linked successfully");

      } catch (err) {
        console.log(err);
        toast.error("Telegram linking failed");
      }
    };
  }, []);

  useEffect(() => {
    if (!user?.telegramId) {
      const script = document.createElement("script");

      script.src = "https://telegram.org/js/telegram-widget.js?22";
      script.async = true;

      script.setAttribute("data-telegram-login", "souq_connect_bot");
      script.setAttribute("data-size", "large");
      script.setAttribute("data-userpic", "false");
      script.setAttribute("data-request-access", "write");

      script.setAttribute(
        "data-onauth",
        "onTelegramAuth(user)"
      );

      const container = document.getElementById(
        "telegram-login-widget"
      );

      if (container) {
        container.innerHTML = "";
        container.appendChild(script);
      }
    }
  }, [user?.telegramId]);

  const handleTelegramUnlink = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        "http://localhost:5000/api/socials/unlink-telegram",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser((prev) => ({
        ...prev,
        telegramId: null,
        telegramUsername: null,
        telegramAvatar: null,
      }));

      toast.success("Telegram unlinked");

    } catch (err) {
      toast.error("Failed to unlink Telegram");
    }
  };

  useEffect(() => {
    const listener = async (event) => {
      if (event.data?.success) {
        toast.success("X linked!");

        const token = localStorage.getItem("token");

        try {
          const user = await fetchMe();

          setUser(user);
        } catch (err) {
          console.log("Failed to refresh user");
        }
      };

      window.addEventListener("message", listener);

      return () => {
        window.removeEventListener("message", listener);
      }
    };
  }, []);

  useEffect(() => {
    const handler = async (event) => {
      if (event.data?.success) {
        const token = localStorage.getItem("token");

        const user = await fetchMe();

        setUser(user);
      }
    };

    window.addEventListener("message", handler);

    return () => window.removeEventListener("message", handler);
  }, []);

  // ✅ THIS is where UI belongs

  return (
    <div className="p-6 text-white max-w-4xl mx-auto">

      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      {/* ACCOUNT */}
      <div className="bg-[#111] p-6 rounded-2xl mb-6 border border-gray-800">
        <h2 className="text-xl font-semibold mb-4">Account</h2>

        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="font-medium">Wallet</p>
            <p className="text-sm text-gray-400">
              {user?.wallet
                ? `${user.wallet.slice(0, 6)}...${user.wallet.slice(-4)}`
                : "Not connected"}
            </p>
          </div>

          <button className="px-4 py-2 bg-gray-700 rounded-lg text-sm">
            Manage
          </button>
        </div>

        {/* google */}

        <div className="flex justify-between items-center mb-4">

          {/* LEFT SIDE */}
          <div className="flex items-center gap-3">
            {/* Avatar */}
            {user?.googleAvatar ? (
              <img
                src={user?.googleAvatar}
                alt="Google Avatar"
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-700 text-gray-300 flex items-center justify-center text-xs">
                {user?.email?.[0]?.toUpperCase() || "G"}
              </div>
            )}

            {/* Text */}
            <div>
              <p className="font-medium">Google</p>
              <p className="text-sm text-gray-400 truncate max-w-[200px]">
                {user?.googleId
                  ? maskEmail(user.email)
                  : "Not connected"}
              </p>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex gap-2">
            <button
              onClick={handleGoogleLink}
              disabled={user?.googleId}
              className={`px-4 py-2 rounded-lg text-sm ${user?.googleId
                ? "bg-green-600 text-white cursor-not-allowed"
                : "bg-[#FFD700] text-black"
                }`}
            >
              {user?.googleId ? "Connected" : "Link Google"}
            </button>

            {user?.googleId && (
              <button
                onClick={handleGoogleUnlink}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm"
              >
                Unlink
              </button>
            )}
          </div>

        </div>

        {/* x wahala */}

        <div className="flex justify-between items-center my-4">

          {/* LEFT SIDE */}
          <div className="flex items-center gap-3">
            {user?.twitterAvatar ? (
              <img
                src={user.twitterAvatar}
                alt="X avatar"
                className="w-8 h-8 rounded-full"
                fallback={user?.twitterUsername?.[0]?.toUpperCase() || "X"}
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-700 text-gray-300 flex items-center justify-center text-xs">
                X
              </div>
            )}

            <div>
              <p className="font-medium">X</p>
              <p className="text-sm text-gray-400">
                {user?.twitterId
                  ? `@${user.twitterUsername}`
                  : "Not connected"}
              </p>
            </div>
          </div>

          {/* RIGHT SIDE (GROUPED BUTTONS) */}
          <div className="flex gap-2">

            <button
              onClick={handleXLink}
              disabled={user?.twitterId}
              className={`px-4 py-2 rounded-lg text-sm ${user?.twitterId
                ? "bg-green-600 text-white cursor-not-allowed"
                : "bg-[#FFD700] text-black"
                }`}
            >
              {user?.twitterId ? "Connected" : "Link X"}
            </button>

            {user?.twitterId && (
              <button
                onClick={handleXUnlink}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm"
              >
                Unlink
              </button>
            )}

          </div>

        </div>

        {/*discord*/}
        <div className="flex justify-between items-center my-4">

          <div className="flex items-center gap-3">
            {user?.discordAvatar ? (
              <img
                src={user.discordAvatar}
                className="w-9 h-9 rounded-full object-cover"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm">
                D
              </div>
            )}

            <div>
              <p className="font-medium">Discord</p>
              <p className="text-sm text-gray-400">
                {user?.discordId ? user.discordUsername : "Not connected"}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleDiscordLink}
              disabled={user?.discordId}
              className={`px-4 py-2 rounded-lg text-sm ${user?.discordId
                ? "bg-green-600 text-white"
                : "bg-[#5865F2] text-white"
                }`}
            >
              {user?.discordId ? "Connected" : "Link Discord"}
            </button>

            {user?.discordId && (
              <button
                onClick={handleDiscordUnlink}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm"
              >
                Unlink
              </button>
            )}
          </div>
        </div>
        {/* telegram UI*/}
        <div className="flex justify-between items-center my-4">

          {/* LEFT SIDE */}
          <div className="flex items-center gap-3">

            {user?.telegramAvatar ? (
              <img
                src={user.telegramAvatar}
                className="w-9 h-9 rounded-full object-cover"
                alt="Telegram avatar"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-sky-500 flex items-center justify-center text-white text-sm">
                T
              </div>
            )}

            <div>
              <p className="font-medium">Telegram</p>

              <p className="text-sm text-gray-400">
                {user?.telegramId
                  ? `@${user.telegramUsername || "user"}`
                  : "Not connected"}
              </p>
              {!user?.telegramId && (
                <p className="text-xs text-gray-500 mt-1">
                  Telegram may remember your last logged-in account.
                </p>
              )}
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-2">

            {!user?.telegramId ? (
              <div id="telegram-login-widget"></div>
            ) : (
              <>
                <button
                  disabled
                  className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm"
                >
                  Connected
                </button>

                <button
                  onClick={handleTelegramUnlink}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm"
                >
                  Unlink
                </button>
              </>
            )}

          </div>
        </div>
      </div>


      {/* PREFERENCES */}
      <div className="bg-[#111] p-6 rounded-2xl mb-6 border border-gray-800">
        <h2 className="text-xl font-semibold mb-4">Preferences</h2>

        <div className="flex justify-between items-center">
          <p>Dark Mode</p>
          <button className="px-4 py-2 bg-gray-700 rounded-lg text-sm">
            Toggle
          </button>
        </div>
      </div>

      {/* SECURITY */}
      <div className="bg-[#111] p-6 rounded-2xl border border-gray-800">
        <h2 className="text-xl font-semibold mb-4">Security</h2>

        <button className="px-4 py-2 bg-red-600 rounded-lg text-sm">
          Logout
        </button>
      </div>

    </div>

  );
}

export default Settings;