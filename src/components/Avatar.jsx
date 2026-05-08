const Avatar = ({ src, fallback }) => {
  return src ? (
    <img
      src={src}
      alt="avatar"
      className="w-9 h-9 rounded-full object-cover border border-gray-700"
      referrerPolicy="no-referrer"
    />
  ) : (
    <div className="w-9 h-9 rounded-full bg-gray-700 text-gray-300 flex items-center justify-center text-sm border border-gray-700">
      {fallback}
    </div>
  );
};

export default Avatar;