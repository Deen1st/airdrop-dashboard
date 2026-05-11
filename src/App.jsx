import { useState, useEffect } from "react";
import Tasks from "./components/Tasks";
import { motion } from "framer-motion";
import Leaderboard from "./components/Leaderboard";
import { LayoutDashboard, ListChecks, Trophy } from "lucide-react";
import logo from "./assets/logo/souqconnect.png";
import axios from "axios";
import QuestDetails from "./pages/QuestDetails";
import { useUser } from "./context/UserContext";
import { Settings as SettingsIcon } from "lucide-react";
import toast from "react-hot-toast";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Settings from "./Settings";
import { useNavigate } from "react-router-dom";
import {
  getNonce,
  walletAuth,
  googleAuth,
} from "./services/authServices";


function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [points, setPoints] = useState(0);
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const connectWallet = async () => {
    try {
      setLoading(true);

      console.log("STEP 1: Click detected");

      if (!window.ethereum) {
        toast.error("MetaMask not installed");
        return;
      }

      console.log("STEP 2: Checking accounts");

      let accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length === 0) {
        console.log("STEP 3: Requesting connection");

        accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
      }

      const wallet = accounts[0];
      console.log("STEP 4: Wallet =", wallet);

      //  NEW STEP — GET NONCE
      console.log("STEP 5: Getting nonce...");
      const nonceRes = await getNonce(wallet);

      const message = nonceRes.message;

      //  NEW STEP — SIGN MESSAGE
      console.log("STEP 6: Signing message...");
      const signature = await window.ethereum.request({
        method: "personal_sign",
        params: [wallet, message],
      });

      //  NEW STEP — SEND SIGNATURE
      console.log("STEP 7: Sending signature to backend...");

      const res = await walletAuth(
        wallet,
        signature
      );

      console.log(" BACKEND RESPONSE:", res);

      localStorage.setItem("token", res.token);

      localStorage.setItem(
        "user",
        JSON.stringify(res.user)
      );

      setUser(res.user);
      toast.success("Wallet connected securely!");

    } catch (err) {
      console.error(" FULL ERROR:", err);
      console.error(" RESPONSE:", err.response?.data);

      toast.error("Secure login failed");

    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setMenuOpen(false);
    setUser(null);
    toast.success("Disconnected");
    console.log("Disconnected");
  };

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      //  ONLY restore if BOTH exist
      if (token && storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }

    } catch (err) {
      console.log("Invalid user in storage");
      setUser(null);
    }
  }, []);

  // FETCH USER FROM BACKEND

  const ELIGIBILITY_POINTS = 1000;
  const progress = Math.min((points / ELIGIBILITY_POINTS) * 100, 100);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) return;

        const res = await axios.get(
          "http://localhost:5000/api/users/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));

      } catch (err) {
        console.log("Failed to fetch user");
        setUser(null);
      }
    };

    fetchUser();
  }, []);

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

          {user?.wallet ? (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-600 text-white font-semibold">
              <span className="w-2 h-2 bg-white rounded-full"></span>
              {`${user.wallet.slice(0, 4)}...${user.wallet.slice(-4)}`}
            </div>
          ) : (
            <button
              onClick={connectWallet}
              disabled={loading}
              className={`px-4 py-2 rounded-full font-semibold ${loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#FFD700] text-black"
                }`}
            >
              {loading ? "Connecting..." : "Connect Wallet"}
            </button>
          )}

          <div className="relative">
            <div
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center cursor-pointer"
            >
              {user?.username?.charAt(0).toUpperCase() || "U"}
            </div>

            {menuOpen && user && (
              <div className="absolute right-0 mt-2 w-56 bg-[#1A1A1A] border border-zinc-700 rounded-xl shadow-lg z-50">

                {/* USER INFO */}
                <div className="p-3 border-b border-zinc-700">
                  <p className="text-white text-sm font-semibold">
                    {user.username}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {user.wallet.slice(0, 6)}...{user.wallet.slice(-4)}
                  </p>
                </div>

                {/* POINTS */}
                <div className="px-3 py-2 text-orange-400 text-sm">
                  Points: {user.points}
                </div>

                {/* profile */}
                <button className="w-full text-left px-3 py-2 text-gray-300 hover:bg-zinc-800 text-sm">
                  Profile
                </button>

                {/* LOGOUT */}
                <button
                  onClick={() => {
                    localStorage.clear();
                    setUser(null);
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-red-400 hover:bg-zinc-800 text-sm"
                >
                  Disconnect Wallet
                </button>

              </div>
            )}
          </div>
        </div>
      </div>

      {/* SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#111] p-6 flex flex-col justify-between transform transition-transform duration-300 z-40 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* TOP */}
        <div>
          <h2 className="text-xl font-bold text-[#FFD700] mb-8">SOUQ</h2>

          <nav className="flex flex-col gap-2">

            <NavLink
              to="/"
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg transition ${isActive
                  ? "bg-[#FFD700]/10 text-[#FFD700]"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
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
                `flex items-center gap-3 px-3 py-2 rounded-lg transition ${isActive
                  ? "bg-[#FFD700]/10 text-[#FFD700]"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
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
                `flex items-center gap-3 px-3 py-2 rounded-lg transition ${isActive
                  ? "bg-[#FFD700]/10 text-[#FFD700]"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <Trophy size={18} />
              Leaderboard
            </NavLink>

          </nav>
        </div>

        {/* BOTTOM (SETTINGS) */}
        <div className="border-t border-gray-800 pt-4">
          <NavLink
            to="/settings"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition ${isActive
                ? "bg-[#FFD700]/10 text-[#FFD700]"
                : "text-gray-500 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <SettingsIcon size={18} />
            Settings
          </NavLink>
        </div>
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
                      {user ? user.completedTasks?.length : 0}
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
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;