import { useState, useEffect } from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import Tasks from "./components/Tasks";
import { motion } from "framer-motion";
import Leaderboard from "./components/Leaderboard";
import { LayoutDashboard, ListChecks, Trophy } from "lucide-react";
import logo from "./assets/logo/souqconnect.png";
import axios from "axios";
import QuestDetails from "./pages/QuestDetails";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [user, setUser] = useState(null);
  const [points, setPoints] = useState(0);

  const connectWallet = async () => {
    console.log("function started");
    try {
      const wallet = "0x123abc"; // use the same one in your DB for now

      const res = await axios.post("http://localhost:5000/api/users/auth", {
        wallet
      });

      console.log("RESPONSE:", res.data); // 👈 MUST show

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setUser(res.data.user);

      alert("Login successful ✅");

    } catch (err) {
      console.log("ERROR:", err); // 👈 MUST show
    alert("Login failed ❌");
    }
  };
  // 🔥 FETCH USER FROM BACKEND
  useEffect(() => {
    axios.get("http://localhost:5000/api/users")

      .then(res => {
        if (res.data.length > 0) {
          setUser(res.data[0]); // for now use first user
          setPoints(res.data[0].points);
        }
      })
      .catch(err => console.log(err));
  }, []);

  const ELIGIBILITY_POINTS = 1000;
  const progress = Math.min((points / ELIGIBILITY_POINTS) * 100, 100);

  return (
    <div className="min-h-screen bg-[#121212] text-white flex">

      {/* TOP BAR */}
      <div className="fixed top-0 left-0 w-full h-16 bg-[#121212] border-b border-zinc-800 flex items-center justify-between px-6 z-50">

        {/* LEFT */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex flex-col justify-between w-5 h-4"
          >
            <span className="h-[2px] w-full bg-white"></span>
            <span className="h-[2px] w-full bg-white"></span>
            <span className="h-[2px] w-full bg-white"></span>
          </button>

          <div className="flex items-center gap-2">
            <img src={logo} alt="logo" className="h-6 w-auto" />
            <span className="font-semibold text-lg text-white">
              Souq Connect
            </span>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700">
            🔔
          </button>

          <button
            onClick={connectWallet}
            className="px-4 py-2 rounded-full bg-[#FFD700] text-black font-semibold"
          >
            Connect Wallet
          </button>

          <div className="w-9 h-9 rounded-full bg-zinc-700 flex items-center justify-center text-sm">
            {user ? user.username[0] : "U"}
          </div>
        </div>
      </div>

      {/* SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#1A1A1A] p-6 space-y-6 transform transition-transform duration-300 z-40 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <h2 className="text-xl font-bold text-[#FFD700]">SOUQ</h2>

        <nav className="flex flex-col gap-2">

          <NavLink to="/" onClick={() => setSidebarOpen(false)} className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded ${isActive
              ? "bg-[#FFD700]/10 text-[#FFD700]"
              : "text-gray-400 hover:text-white"}`
          }>
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>

          <NavLink to="/tasks" onClick={() => setSidebarOpen(false)} className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded ${isActive
              ? "bg-[#FFD700]/10 text-[#FFD700]"
              : "text-gray-400 hover:text-white"}`
          }>
            <ListChecks size={18} />
            Tasks
          </NavLink>

          <NavLink to="/leaderboard" onClick={() => setSidebarOpen(false)} className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded ${isActive
              ? "bg-[#FFD700]/10 text-[#FFD700]"
              : "text-gray-400 hover:text-white"}`
          }>
            <Trophy size={18} />
            Leaderboard
          </NavLink>

        </nav>
      </aside>

      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black bg-opacity-50 z-30" />
      )}

      {/* MAIN */}
      <main className="flex-1 p-8 mt-16">
        <Routes>

          {/* DASHBOARD */}
          <Route
            path="/"
            element={
              <motion.div className="space-y-8">

                {/* CARDS */}
                <div className="grid grid-cols-3 gap-6">

                  <div className="bg-[#1A1A1A] p-6 rounded-xl">
                    <p className="text-gray-400">Total Points</p>
                    <h2 className="text-2xl font-bold text-[#FFD700]">{points}</h2>
                  </div>

                  <div className="bg-[#1A1A1A] p-6 rounded-xl">
                    <p className="text-gray-400">Tasks Completed</p>
                    <h2 className="text-2xl font-bold">
                      {user ? user.completedTasks.length : 0}
                    </h2>
                  </div>

                  <div className="bg-[#1A1A1A] p-6 rounded-xl">
                    <p className="text-gray-400">Rank</p>
                    <h2 className="text-2xl font-bold">#--</h2>
                  </div>

                </div>

                {/* PROGRESS */}
                <div className="bg-[#1A1A1A] p-6 rounded-xl">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span>{Math.floor(progress)}%</span>
                  </div>

                  <div className="w-full bg-gray-800 h-3 rounded">
                    <div
                      className="h-3 rounded"
                      style={{
                        width: `${progress}%`,
                        background: "linear-gradient(90deg, #39FF14, #00FFAA)"
                      }}
                    />
                  </div>
                </div>

                {/* TASKS */}
                <Tasks user={user} setPoints={setPoints} />

              </motion.div>
            }
          />

          <Route path="/tasks" element={<Tasks user={user} setPoints={setPoints} />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route
            path="/quest/:id"
            element={<QuestDetails user={user} setPoints={setPoints} />}
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;