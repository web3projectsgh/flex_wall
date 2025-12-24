import React from "react";

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
    <section
      style={{
        width: "100%",
        maxWidth: "48rem",
        margin: "0 auto",
        borderRadius: "2rem",
        boxShadow:
          "0 8px 40px 0 rgba(51, 100, 180, 0.18), 0 1.5px 8px 0 rgba(51,100,180,0.10) inset",
        padding: "2.5rem",
        marginBottom: "2.5rem",
        border: "1.5px solid #334155",
        background:
          "linear-gradient(135deg, rgba(24,34,54,0.92) 0%, rgba(40,60,110,0.82) 100%)",
        backdropFilter: "blur(28px) saturate(1.7)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Reflet liquide glassmorphism */}
      <span
        style={{
          position: "absolute",
          top: "-30%",
          left: "-20%",
          width: "140%",
          height: "80%",
          background:
            "radial-gradient(ellipse at 60% 40%, rgba(60,120,255,0.22) 0%, rgba(24,34,54,0.18) 60%, transparent 100%)",
          filter: "blur(38px)",
          zIndex: 1,
          pointerEvents: "none",
          opacity: 0.7,
        }}
      />
      <h2 className="text-3xl font-extrabold mb-6 text-center text-blue-900 dark:text-blue-100 drop-shadow relative z-10">
        Leaderboard
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        {/* Top Buyers */}
        <div
          style={{
            background: "rgba(24,34,54,0.92)",
            borderRadius: "1.5rem",
            boxShadow: "0 4px 24px 0 rgba(51, 100, 180, 0.13)",
            padding: "1.5rem",
            border: "1.5px solid #334155",
            position: "relative",
            overflow: "hidden",
            backdropFilter: "blur(16px) saturate(1.3)",
          }}
        >
          <span
            style={{
              position: "absolute",
              top: "-20%",
              left: "-10%",
              width: "120%",
              height: "60%",
              background:
                "radial-gradient(ellipse at 60% 40%, rgba(60,120,255,0.16) 0%, rgba(24,34,54,0.13) 60%, transparent 100%)",
              filter: "blur(28px)",
              zIndex: 1,
              pointerEvents: "none",
              opacity: 0.6,
            }}
          />
          <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2 relative z-10">
            <span className="text-xl">🏆</span> Top Buyers
            <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-200 dark:bg-blue-800 text-xs font-bold text-blue-900 dark:text-white shadow-sm border border-blue-300 dark:border-blue-700">
              All Time
            </span>
          </h3>
          {classementGlobal.length === 0 ? (
            <p className="text-gray-400 text-center py-4">No buyers yet.</p>
          ) : (
            <ol className="flex flex-col gap-1">
              {classementGlobal.slice(0, 10).map((user, i) => (
                <li
                  key={user.wallet}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl min-h-[44px] transition-all bg-white/60 dark:bg-zinc-900/60 border border-blue-100 dark:border-blue-800 shadow-sm relative z-10`}
                >
                  <span className="font-bold text-base shrink-0 w-7 text-center text-blue-900 dark:text-white">
                    {i === 0
                      ? "🥇"
                      : i === 1
                      ? "🥈"
                      : i === 2
                      ? "🥉"
                      : `#${i + 1}`}
                  </span>
                  <span className="font-mono text-base flex flex-wrap items-center gap-x-2 gap-y-1 min-w-0 font-bold text-blue-900 dark:text-white">
                    <span
                      className="truncate max-w-[90px] sm:max-w-[120px] inline-block align-middle"
                      title={user.wallet}
                    >
                      {user.wallet.slice(0, 6)}...{user.wallet.slice(-4)}
                    </span>
                  </span>
                  <span className="ml-auto font-bold text-base flex items-center gap-1 text-blue-900 dark:text-white">
                    {user.score.toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 4,
                    })}
                    <span className="text-xs font-semibold ml-1">◎</span>
                  </span>
                </li>
              ))}
            </ol>
          )}
        </div>
        {/* Daily Top */}
        <div
          style={{
            background: "rgba(24,34,54,0.92)",
            borderRadius: "1.5rem",
            boxShadow: "0 4px 24px 0 rgba(51, 100, 180, 0.13)",
            padding: "1.5rem",
            border: "1.5px solid #334155",
            position: "relative",
            overflow: "hidden",
            backdropFilter: "blur(16px) saturate(1.3)",
          }}
        >
          <span
            style={{
              position: "absolute",
              top: "-20%",
              left: "-10%",
              width: "120%",
              height: "60%",
              background:
                "radial-gradient(ellipse at 60% 40%, rgba(60,255,220,0.13) 0%, rgba(24,34,54,0.13) 60%, transparent 100%)",
              filter: "blur(28px)",
              zIndex: 1,
              pointerEvents: "none",
              opacity: 0.6,
            }}
          />
          <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-100 mb-3 flex items-center gap-2 relative z-10">
            <span className="text-xl">🌟</span> Daily Top
            <span className="ml-2 px-2 py-0.5 rounded-full bg-emerald-200 dark:bg-emerald-800 text-xs font-bold text-emerald-900 dark:text-white shadow-sm border border-emerald-300 dark:border-emerald-700">
              Today
            </span>
          </h3>
          {classementJour.length === 0 ? (
            <p className="text-gray-400 text-center py-4">No buyers today.</p>
          ) : (
            <ol className="flex flex-col gap-1">
              {classementJour.slice(0, 10).map((user, i) => (
                <li
                  key={user.wallet}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl min-h-[40px] transition-all bg-white/60 dark:bg-zinc-900/60 border border-emerald-100 dark:border-emerald-800 shadow-sm relative z-10`}
                >
                  <span className="font-bold text-base shrink-0 w-7 text-center text-emerald-900 dark:text-white">
                    {i === 0 ? "🥇" : `#${i + 1}`}
                  </span>
                  <span className="font-mono text-base flex flex-wrap items-center gap-x-2 gap-y-1 min-w-0 font-bold text-emerald-900 dark:text-white">
                    <span
                      className="truncate max-w-[90px] sm:max-w-[120px] inline-block align-middle"
                      title={user.wallet}
                    >
                      {user.wallet.slice(0, 6)}...{user.wallet.slice(-4)}
                    </span>
                  </span>
                  <span className="ml-auto font-bold text-base flex items-center gap-1 text-emerald-900 dark:text-white">
                    {user.score.toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 4,
                    })}
                    <span className="text-xs font-semibold ml-1">◎</span>
                  </span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </section>
  );
};

export default Classement;
