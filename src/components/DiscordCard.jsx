const DiscordCard = ({
    user,
    handleDiscordLink,
    handleDiscordUnlink,
}) => {
    
    return (
        <div className="flex justify-between items-center my-4">

            {/* LEFT SIDE */}
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
                        {user?.discordId
                            ? user.discordUsername
                            : "Not connected"}
                    </p>
                </div>

            </div>

            {/* RIGHT SIDE */}
            <div className="flex gap-2">

                <button
                    onClick={handleDiscordLink}
                    disabled={user?.discordId}
                    className={`px-4 py-2 rounded-lg text-sm ${user?.discordId
                            ? "bg-green-600 text-white"
                            : "bg-[#5865F2] text-white"
                        }`}
                >
                    {user?.discordId
                        ? "Connected"
                        : "Link Discord"}
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
    );
};

export default DiscordCard;