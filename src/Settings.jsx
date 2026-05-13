import { useUser } from "./context/UserContext";
import toast from "react-hot-toast";
import { useEffect } from "react";
import Avatar from "./components/Avatar";
import useTelegramAuth from "./hooks/useTelegramAuth";
import useDiscordAuth from "./hooks/useDiscordAuth";
import useGoogleAuth from "./hooks/useGoogleAuth";
import useXAuth from "./hooks/useXAuth";
import useSocialAuthListener from "./hooks/useSocialAuthListener";
import {
  linkGoogle,
  unlinkGoogle,
  startXAuth,
  unlinkX,
  unlinkDiscord,
  linkTelegram,
  unlinkTelegram,
} from "./services/socialServices";
import { fetchMe } from "./services/userServices";
import useTelegramActions from "./hooks/useTelegramActions";
import GoogleCard from "./components/GoogleCard";
import XCard from "./components/XCard";
import DiscordCard from "./components/DiscordCard";
import TelegramCard from "./components/TelegramCard";

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
  useSocialAuthListener(fetchMe, setUser);
  useTelegramAuth({
    user,
    setUser,
    linkTelegram,
  });

  const {
    handleGoogleLink,
    handleGoogleUnlink,
  } = useGoogleAuth({
    user,
    setUser,
    linkGoogle,
    unlinkGoogle,
  });

  const {
    handleXLink,
    handleXUnlink,
  } = useXAuth({
    user,
    setUser,
    startXAuth,
    unlinkX,
  });

  const {
    handleDiscordLink,
    handleDiscordUnlink,
  } = useDiscordAuth({
    user,
    setUser,
    unlinkDiscord,
  });

  const {
    handleTelegramUnlink,
  } = useTelegramActions({
    setUser,
    unlinkTelegram,
  });

  //  THIS is where UI belongs

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

        <GoogleCard
          user={user}
          handleGoogleLink={handleGoogleLink}
          handleGoogleUnlink={handleGoogleUnlink}
          maskEmail={maskEmail}
        />

        {/* x wahala */}

        <XCard
          user={user}
          handleXLink={handleXLink}
          handleXUnlink={handleXUnlink}
        />

        {/*discord*/}
        <DiscordCard
          user={user}
          handleDiscordLink={handleDiscordLink}
          handleDiscordUnlink={handleDiscordUnlink}
        />

        {/* telegram UI*/}
        <TelegramCard
          user={user}
          handleTelegramUnlink={handleTelegramUnlink}
        />
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