import { useState, useEffect } from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import Tasks from "./components/Tasks";
import { motion } from "framer-motion";
import Leaderboard from "./components/Leaderboard";
import { LayoutDashboard, ListChecks, Trophy } from "lucide-react";
import logo from "./assets/logo/souqconnect.png";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [points, setPoints] = useState(() => {
    const saved = localStorage.getItem("points");
    return saved ? JSON.parse(saved) : 0;
  });

  useEffect(() => {
    localStorage.setItem("points", JSON.stringify(points));
  }, [points]);

  const ELIGIBILITY_POINTS = 1000;
  const progress = Math.min((points / ELIGIBILITY_POINTS) * 100, 100);

  return (
    <div className="min-h-screen bg-[#121212] text-white flex">
      <div className="flex items-center gap-3">
        <div className="fixed top-0 left-0 w-full h-16 bg-[#121212] border-b border-zinc-800 flex items-center justify-between px-6 z-50">

          {/* LEFT SIDE */}
          <div className="flex items-center gap-3">

            {/* HAMBURGER */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex flex-col justify-between w-5 h-4"
            >
              <span className="h-[2px] w-full bg-white"></span>
              <span className="h-[2px] w-full bg-white"></span>
              <span className="h-[2px] w-full bg-white"></span>
            </button>

            {/* LOGO */}
            <div className="flex items-center gap-2">
              <img src={logo} alt="logo" className="h-6 w-auto" />
              <span className="font-semibold text-lg text-white">
                Souq Connect
              </span>
            </div>

          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-4">

            {/* Notification */}
            <button className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 shadow-[0_0_10px_#FFD700] transition">
              🔔
            </button>

            {/* Wallet */}
            <button className="px-4 py-2 rounded-full bg-[#FFD700] text-black font-semibold hover:scale-105 transition">
              Connect Wallet
            </button>

            {/* Profile */}
            <div className="w-9 h-9 rounded-full bg-zinc-700 flex items-center justify-center text-sm">
              U
            </div>

          </div>

        </div>

      </div>
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#1A1A1A] p-6 space-y-6 transform transition-transform duration-300 z-40 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <h2 className="text-xl font-bold text-[#FFD700]">SOUQ</h2>

        <nav className="flex flex-col gap-2">

          <NavLink
            to="/"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded transition ${isActive
                ? "bg-[#FFD700]/10 text-[#FFD700] shadow-[0_0_10px_#FFD700]"
                : "text-gray-400 hover:text-white"
              }`
            }
          >
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>

          <NavLink
            to="/tasks"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded transition ${isActive
                ? "bg-[#FFD700]/10 text-[#FFD700] shadow-[0_0_10px_#FFD700]"
                : "text-gray-400 hover:text-white"
              }`
            }
          >
            <ListChecks size={18} />
            Tasks
          </NavLink>

          <NavLink
            to="/leaderboard"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded transition ${isActive
                ? "bg-[#FFD700]/10 text-[#FFD700] shadow-[0_0_10px_#FFD700]"
                : "text-gray-400 hover:text-white"
              }`
            }
          >
            <Trophy size={18} />
            Leaderboard
          </NavLink>
        </nav>

      </aside>
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
        />
      )}
      {/* Main */}
      <main className="flex-1 p-8 mt-16">
        <Routes>

          {/* Dashboard */}
          <Route
            path="/"
            element={
              <motion.div
                className="space-y-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >

                {/* Cards */}
                <motion.div
                  className="grid grid-cols-3 gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >

                  <motion.div whileHover={{ scale: 1.05 }} className="bg-[#1A1A1A] p-6 rounded-xl">
                    <p className="text-gray-400">Total Points</p>
                    <h2 className="text-2xl font-bold text-[#FFD700]">{points}</h2>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.05 }} className="bg-[#1A1A1A] p-6 rounded-xl">
                    <p className="text-gray-400">Tasks Completed</p>
                    <h2 className="text-2xl font-bold">0</h2>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.05 }} className="bg-[#1A1A1A] p-6 rounded-xl">
                    <p className="text-gray-400">Rank</p>
                    <h2 className="text-2xl font-bold">#--</h2>
                  </motion.div>

                </motion.div>

                {/* Progress */}
                <div className="bg-[#1A1A1A] p-6 rounded-xl">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span>{Math.floor(progress)}%</span>
                  </div>

                  <div className="w-full bg-gray-800 h-3 rounded">
                    <motion.div
                      className="h-3 rounded"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.8 }}
                      style={{
                        background: "linear-gradient(90deg, #39FF14, #00FFAA)"
                      }}
                    />
                  </div>
                </div>

                {/* Tasks */}
                <Tasks setPoints={setPoints} />

                {/* Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 rounded-lg font-semibold 
      bg-[#39FF14] text-black 
      shadow-[0_0_15px_#39FF14]"
                >
                  Claim Rewards
                </motion.button>

              </motion.div>
            }
          />

          <Route path="/tasks" element={<Tasks setPoints={setPoints} />} />
          <Route path="/leaderboard" element={<Leaderboard userPoints={points} />} />

        </Routes>
      </main>

    </div >
  );
}

export default App;