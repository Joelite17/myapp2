export default function ProfileInfo({ user }) {
  return (
    <div className="bg-green-600 text-white shadow-md rounded-lg p-6 border border-green-700 flex items-center space-x-6">
      <img
        src={user.avatar}
        alt={user.name}
        className="w-24 h-24 rounded-full object-cover border-4 border-green-300"
      />
      <div>
        <h2 className="text-2xl font-semibold">{user.name}</h2>
        <p className="text-green-100 text-sm">{user.username}</p>
        <p className="text-green-50 mt-2">{user.bio}</p>
        <div className="flex gap-6 mt-3 text-sm text-green-100">
          <span>{user.followers} Followers</span>
          <span>{user.following} Following</span>
        </div>
      </div>
    </div>
  );
}
