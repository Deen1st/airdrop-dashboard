const TelegramCard = ({
  user,
  handleTelegramUnlink,
}) => {
  return (
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
  );
};

export default TelegramCard;