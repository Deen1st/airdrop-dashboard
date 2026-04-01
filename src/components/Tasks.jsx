import { motion } from "framer-motion";

const mockTasks = [
  {
    id: 1,
    title: "Centralized Exchange",
    subtitle: "Onboarding New User",
    tag1: "Timed Task",
    tag2: "Sign up & KYC",
  },
  {
    id: 2,
    title: "Centralized Exchange",
    subtitle: "Meet Trading Volume Requiremnt",
    tag1: "Timed Task",
    tag2: "Deposit & Trade",
  },
  {
    id: 3,
    title: "Smart Contract Review",
    subtitle: "Security Analysis",
    tag1: "Hot",
    tag2: "Advanced",
  },
  {
    id: 4,
    title: "DeFi Simulation",
    subtitle: "Liquidity Training",
    tag1: "New",
    tag2: "Beginner",
  },
];

function Tasks({ setPoints }) {
  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">
          Recommended Projects
        </h2>

        <button className="text-sm text-gray-400 hover:text-white">
          View All
        </button>
      </div>

      {/* TASK GRID */}
      <div className="grid grid-cols-2 gap-5">

        {mockTasks.map((task) => (
          <motion.div
            key={task.id}
            whileHover={{ scale: 1.03 }}
            className="bg-zinc-900 border border-zinc-800 hover:border-zinc-600 rounded-xl p-5 transition cursor-pointer hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]"
          >

            {/* TAGS */}
            <div className="flex justify-between mb-4 text-xs">

              <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded">
                {task.tag1}
              </span>

              <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded">
                {task.tag2}
              </span>

            </div>

            {/* CONTENT */}
            <div className="space-y-2">
              <p className="text-xs text-gray-500">Souq Connect</p>

              <h3 className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
  {task.title}
</h3>

              <p className="text-sm text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 drop-shadow-[0_0_6px_rgba(255,0,150,0.4)]">
  {task.subtitle}
</p>
            </div>

            {/* IMAGE / VISUAL BLOCK */}
            <div className="mt-4 h-24 rounded-lg bg-gradient-to-r from-zinc-800 to-zinc-700 flex items-center justify-center text-gray-500 text-xs">
              Preview
            </div>

            {/* ACTION BUTTON */}
            <button
              onClick={() => setPoints((prev) => prev + 50)}
              className="mt-4 w-full py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition text-sm"
            >
              Start Task
            </button>

          </motion.div>
        ))}

      </div>
    </div>
  );
}

export default Tasks;