import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


function QuestDetails({ user, setPoints }) {
    const { id } = useParams();
    const [quest, setQuest] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:5000/api/quest/${id}`)
            .then(res => setQuest(res.data))
            .catch(err => console.log(err));
    }, [id]);

    if (!quest) return <p className="text-white">Loading quest...</p>;

    return (
        <div className="space-y-6">

            {/* 🔙 BACK BUTTON */}
            <button
                onClick={() => navigate(-1)}
                className="text-gray-400 hover:text-white"
            >
                ← Back
            </button>

            {/* 🧱 QUEST HEADER */}
            <div className="bg-[#1A1A1A] p-6 rounded-xl border border-zinc-800">
                <h1 className="text-2xl font-bold text-white">
                    {quest.title}
                </h1>

                <p className="text-gray-400 mt-2">
                    {quest.description}
                </p>
            </div>

            {/* 📋 TASKS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {quest.tasks.map((task) => (
                    <div
                        key={task._id}
                        className="bg-[#1A1A1A] rounded-2xl p-5 border border-zinc-800 hover:border-orange-500 transition"
                    >
                        <h3 className="text-white font-semibold text-lg">
                            {task.title}
                        </h3>

                        <p className="text-gray-400 text-sm mt-1">
                            {task.description}
                        </p>

                        <div className="mt-3 flex justify-between items-center">
                            <span className="text-orange-400 font-bold">
                                {task.points} pts
                            </span>

                            <button className="bg-zinc-800 px-3 py-1 rounded text-sm hover:bg-zinc-700">
                                Start
                            </button>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}

export default QuestDetails;