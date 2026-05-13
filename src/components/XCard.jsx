const XCard = ({
    user,
    handleXLink,
    handleXUnlink,
}) => {
    return (
        <div className="flex justify-between items-center my-4">

            {/* LEFT SIDE */}
            <div className="flex items-center gap-3">

                {user?.twitterAvatar ? (
                    <img
                        src={user.twitterAvatar}
                        alt="X avatar"
                        className="w-8 h-8 rounded-full"
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

            {/* RIGHT SIDE */}
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
    );
};

export default XCard;