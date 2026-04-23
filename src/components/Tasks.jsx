import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Tasks({ user, setPoints }) {
  const navigate = useNavigate();
  const [quests, setQuests] = useState([]);

  // Fetch quests
  useEffect(() => {
    axios.get("http://localhost:5000/api/quest")
      .then(res => setQuests(res.data))
      .catch(err => console.log(err));
  }, []);

  // Complete task
  const handleTaskClick = async (taskId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/api/users/complete-task",
        { taskId }, // ✅ keep only this
        {
          headers: {
            Authorization: token // ✅ add this
          }
        }
      );

      setPoints(res.data.user.points);
      alert("✅ Task completed!");

    } catch (error) {
      alert(error.response?.data?.error || "Error");
    }
  };
  const openTask = (task) => {
    setSelectedTask(task);
  };

  if (!user) return <p className="text-white">No user found...</p>;

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">
          Recommended Projects
        </h2>
      </div>

      {/* QUEST GRID */}
      <div className="space-y-6">
        {quests.map((quest) => (
          <motion.div
            key={quest._id}
            whileHover={{ scale: 1.03 }}
            onClick={() => navigate(`/quest/${quest._id}`)}
            className="bg-[#1A1A1A] p-6 rounded-xl cursor-pointer border border-zinc-800 hover:border-orange-500 transition"
          >

            <span className="text-xs px-2 py-1 rounded bg-orange-500/20 text-orange-400">
              {quest.type}
            </span>

            <h3 className="text-white font-bold text-lg mt-2">
              {quest.type === "social" && "📱 Social Tasks"}
              {quest.type === "trading" && "📊 Trading Tasks"}
              {quest.type === "onboarding" && "🚀 Getting Started"}

              {!quest.type && quest.title} {/* 👈 fallback */}
            </h3>

            <p className="text-gray-400 text-sm mt-1">
              {quest.description}
            </p>
          </motion.div>
        ))}
      </div>

    </div>
  );
};
export default Tasks;