import React from "react";
import { motion } from "framer-motion";

export type ClassementUser = { wallet: string; score: number };

interface ClassementProps {
  classementGlobal: ClassementUser[];
  classementJour: ClassementUser[];
}

const Classement: React.FC<ClassementProps> = ({
  classementGlobal,
  classementJour,
}) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-4xl mx-auto rounded-3xl p-8 mb-8 text-white relative overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.06)",
        backdropFilter: "blur(16px) saturate(1.2)",
        WebkitBackdropFilter: "blur(16px) saturate(1.2)",
        border: "1px solid rgba(255,255,255,0.2)",
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
      }}
    >
      {/* Reflet liquide glassmorphism */}
      <span
        className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-70"
        style={{
          background:
            "radial-gradient(ellipse at 30% 30%, rgba(255,255,255,0.1) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <motion.h2
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="text-4xl font-extrabold mb-8 text-center drop-shadow-lg relative z-10"
      >
        Leaderboard
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        {/* Top Buyers */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="rounded-2xl p-6 relative overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(12px) saturate(1.1)",
            border: "1px solid rgba(255,255,255,0.15)",
            boxShadow: "0 4px 24px 0 rgba(31, 38, 135, 0.2)",
          }}
        >
          <span
            className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-50"
            style={{
              background:
                "radial-gradient(ellipse at 60% 40%, rgba(255,255,255,0.05) 0%, transparent 60%)",
              filter: "blur(30px)",
            }}
          />
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2 relative z-10">
            <span className="text-2xl">🏆</span> Top Buyers
            <span className="ml-2 px-3 py-1 rounded-full bg-white/20 text-sm font-bold shadow-sm border border-white/30">
              All Time
            </span>
          </h3>
          {classementGlobal.length === 0 ? (
            <p className="text-white/70 text-center py-4">No buyers yet.</p>
          ) : (
            <ol className="flex flex-col gap-2">
              {classementGlobal.slice(0, 10).map((user, i) => (
                <motion.li
                  key={user.wallet}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.3 }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 border border-white/20 shadow-sm relative z-10 hover:bg-white/15 transition-all"
                >
                  <span className="font-bold text-lg shrink-0 w-8 text-center">
                    {i === 0
                      ? "🥇"
                      : i === 1
                      ? "🥈"
                      : i === 2
                      ? "🥉"
                      : `#${i + 1}`}
                  </span>
                  <span className="font-mono text-sm flex flex-wrap items-center gap-x-2 gap-y-1 min-w-0 font-bold">
                    <span
                      className="truncate max-w-[100px] sm:max-w-[140px] inline-block align-middle"
                      title={user.wallet}
                    >
                      {user.wallet.slice(0, 6)}...{user.wallet.slice(-4)}
                    </span>
                  </span>
                  <span className="ml-auto font-bold text-lg flex items-center gap-1">
                    {user.score.toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 4,
                    })}
                    <span className="text-sm font-semibold ml-1">◎</span>
                  </span>
                </motion.li>
              ))}
            </ol>
          )}
        </motion.div>
        {/* Daily Top */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="rounded-2xl p-6 relative overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(12px) saturate(1.1)",
            border: "1px solid rgba(255,255,255,0.15)",
            boxShadow: "0 4px 24px 0 rgba(31, 38, 135, 0.2)",
          }}
        >
          <span
            className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-50"
            style={{
              background:
                "radial-gradient(ellipse at 60% 40%, rgba(255,255,255,0.05) 0%, transparent 60%)",
              filter: "blur(30px)",
            }}
          />
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2 relative z-10">
            <span className="text-2xl">🌟</span> Daily Top
            <span className="ml-2 px-3 py-1 rounded-full bg-white/20 text-sm font-bold shadow-sm border border-white/30">
              Today
            </span>
          </h3>
          {classementJour.length === 0 ? (
            <p className="text-white/70 text-center py-4">No buyers today.</p>
          ) : (
            <ol className="flex flex-col gap-2">
              {classementJour.slice(0, 10).map((user, i) => (
                <motion.li
                  key={user.wallet}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.3 }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 border border-white/20 shadow-sm relative z-10 hover:bg-white/15 transition-all"
                >
                  <span className="font-bold text-lg shrink-0 w-8 text-center">
                    {i === 0 ? "🥇" : `#${i + 1}`}
                  </span>
                  <span className="font-mono text-sm flex flex-wrap items-center gap-x-2 gap-y-1 min-w-0 font-bold">
                    <span
                      className="truncate max-w-[100px] sm:max-w-[140px] inline-block align-middle"
                      title={user.wallet}
                    >
                      {user.wallet.slice(0, 6)}...{user.wallet.slice(-4)}
                    </span>
                  </span>
                  <span className="ml-auto font-bold text-lg flex items-center gap-1">
                    {user.score.toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 4,
                    })}
                    <span className="text-sm font-semibold ml-1">◎</span>
                  </span>
                </motion.li>
              ))}
            </ol>
          )}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Classement;
