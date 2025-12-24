"use client";
import Image from "next/image";
import React, { ReactNode } from "react";
import { useWallet } from "../providers/WalletProvider";
import { motion } from "framer-motion";

export default function Header({ children }: { children?: ReactNode }) {
  const { wallet, connect, disconnect, loading } = useWallet();

  const handleConnect = async () => await connect();

  return (
    <div
      className="w-full sticky top-0 z-50 flex justify-between items-center py-2 px-8 rounded-b-3xl border-b border-white/20 shadow-lg"
      style={{
        background: "rgba(255,255,255,0.06)",
        backdropFilter: "blur(16px) saturate(1.2)",
        WebkitBackdropFilter: "blur(16px) saturate(1.2)",
      }}
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 90, damping: 16 }}
      >
        <div className="flex items-center gap-3 cursor-pointer select-none">
          <div>
            <motion.div
              whileHover={{ scale: 1.08, rotate: 2 }}
              transition={{ type: "spring", stiffness: 250, damping: 20 }}
            >
              <Image
                src="/logo.jpg"
                alt="Logo"
                className="w-16 h-16 rounded-full"
                width={64}
                height={64}
              />
            </motion.div>
          </div>
          <span className="font-extrabold text-3xl text-white tracking-tight drop-shadow-md">
            FlexWall
          </span>
        </div>
      </motion.div>

      <div className="flex items-center gap-4">
        {wallet ? (
          <>
            <span className="text-sm font-mono bg-white/10 px-4 py-1 rounded-xl border border-white/30 shadow-md text-white transition-transform transform hover:scale-105">
              {wallet.slice(0, 6)}...{wallet.slice(-4)}
            </span>

            {children}

            <button
              onClick={disconnect}
              className="px-5 py-2 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 border border-red-900/30 shadow-md transition-transform duration-150 transform hover:scale-105 active:scale-95"
            >
              Disconnect
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={handleConnect}
            className="relative px-6 py-2 rounded-2xl font-bold text-white backdrop-blur-lg bg-white/10 border border-white/30 shadow-xl overflow-hidden transition-all duration-200 hover:bg-white/20 hover:scale-105 active:scale-95 disabled:opacity-60"
            disabled={loading}
            style={{
              WebkitBackdropFilter: "blur(16px) saturate(1.5)",
              backdropFilter: "blur(16px) saturate(1.5)",
              border: "1.5px solid rgba(255,255,255,0.25)",
              boxShadow: "0 4px 24px 0 rgba(31, 38, 135, 0.17)",
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.05) 100%)",
              transition: "transform 0.2s, background 0.2s, box-shadow 0.2s",
            }}
            onMouseOver={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform =
                "scale(1.07)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 8px 32px 0 rgba(31, 38, 135, 0.37)";
              (e.currentTarget as HTMLButtonElement).style.background =
                "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 100%)";
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "";
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 4px 24px 0 rgba(31, 38, 135, 0.17)";
              (e.currentTarget as HTMLButtonElement).style.background =
                "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.05) 100%)";
            }}
            onMouseDown={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform =
                "scale(0.97)";
            }}
            onMouseUp={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform =
                "scale(1.07)";
            }}
          >
            <span className="relative z-10 drop-shadow-lg">
              {loading ? "Connecting..." : "Connect Phantom Wallet"}
            </span>
            <span
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.25) 0%, transparent 70%)",
                opacity: 0.7,
                mixBlendMode: "lighten",
              }}
            />
          </button>
        )}
      </div>
    </div>
  );
}
