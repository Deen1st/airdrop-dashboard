const GoogleCard = ({
    user,
    handleGoogleLink,
    handleGoogleUnlink,
    maskEmail,
}) => {
    return (
        <div className="flex justify-between items-center mb-4">

            <div className="flex items-center gap-3">

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

                <div>
                    <p className="font-medium">Google</p>

                    <p className="text-sm text-gray-400 truncate max-w-[200px]">
                        {user?.googleId
                            ? maskEmail(user.email)
                            : "Not connected"}
                    </p>
                </div>

            </div>

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
    );
};

export default GoogleCard;