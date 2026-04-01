import { Trophy } from "lucide-react";

const mockUsers = [
  {
    name: "ton...l.com",
    points: 147490,
    task: 12500,
    referral: 9300,
    commission: 125670,
  },
  {
    name: "ali...l.com",
    points: 144830,
    task: 12500,
    referral: 8800,
    commission: 123530,
  },
  {
    name: "jkr...p.com",
    points: 944830,
    task: 12300,
    referral: 24400,
    commission: 32530,
  },
  {
    name: "thi...w.com",
    points: 676767,
    task: 767676,
    referral: 6700,
    commission: 456767,
  },
  {
    name: "ali...l.com",
    points: 144830,
    task: 12500,
    referral: 8800,
    commission: 123530,
  },
  {
    name: "ali...l.com",
    points: 144830,
    task: 12500,
    referral: 8800,
    commission: 123530,
  },
  {
    name: "ali...l.com",
    points: 144830,
    task: 12500,
    referral: 8800,
    commission: 123530,
  },
];

export default function Leaderboard({ userPoints }) {
  return (
    <div className="space-y-6">

      {/* 🔥 TOP BANNER */}
      <div className="bg-gradient-to-r from-orange-200 to-orange-100 rounded-2xl p-6 flex justify-between items-center">

        <div>
          <h2 className="text-2xl font-bold text-black">Leaderboard</h2>

          <div className="flex items-center gap-3 mt-3">
            <div className="w-10 h-10 rounded-full bg-gray-300"></div>
            <span className="text-black font-semibold">yourname.com</span>
          </div>

          <div className="flex gap-10 mt-4 text-black">

            <div>
              <p className="text-xl font-bold">860088</p>
              <p className="text-sm text-gray-600">Rank</p>
            </div>

            <div>
              <p className="font-semibold">0</p>
              <p className="text-sm text-gray-600">Task Points</p>
            </div>

            <div>
              <p className="font-semibold">0</p>
              <p className="text-sm text-gray-600">Referral Points</p>
            </div>

            <div>
              <p className="font-semibold">{userPoints}</p>
              <p className="text-sm text-gray-600">Total Points</p>
            </div>

          </div>
        </div>

        <Trophy size={60} className="text-yellow-500" />
      </div>

      {/* 🔥 FILTER BAR */}
      <div className="flex justify-between items-center">

        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-full bg-black text-white">
            Season 1
          </button>
          <button className="px-4 py-2 rounded-full bg-zinc-800 text-gray-400">
            Season Beta
          </button>
        </div>

        <input
          type="text"
          placeholder="Search users..."
          className="bg-zinc-900 px-4 py-2 rounded-lg outline-none"
        />
      </div>

      {/* 🔥 TABLE HEADER */}
      <div className="grid grid-cols-5 text-gray-400 text-sm px-4">
        <span>Position</span>
        <span>User</span>
        <span>Task Points</span>
        <span>Referral Points</span>
        <span>Total Points</span>
      </div>

      {/* 🔥 USERS LIST */}
      <div className="space-y-3">

        {mockUsers.map((user, index) => (
          <div
            key={index}
            className="grid grid-cols-5 items-center bg-zinc-900 p-4 rounded-xl hover:bg-zinc-800 transition"
          >

            {/* POSITION */}
            <span>
              {index === 0 && "🥇"}
              {index === 1 && "🥈"}
              {index === 2 && "🥉"}
              {index > 2 && `#${index + 1}`}
            </span>

            {/* USER */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-500 rounded-full"></div>
              <span>{user.name}</span>
            </div>

            <span>{user.task}</span>
            <span>{user.referral}</span>
            <span className="text-yellow-400 font-semibold">
              {user.points}
            </span>

          </div>
        ))}

      </div>
    </div>
  );
  
}
