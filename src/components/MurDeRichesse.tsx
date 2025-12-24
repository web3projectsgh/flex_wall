"use client";

import Image from "next/image";
import { useState, useEffect, FormEvent } from "react";
import { useWallet } from "../providers/WalletProvider";
import Header from "./Header";
import Modal from "./Modal";
import Classement from "./Classement";
import { motion, AnimatePresence } from "framer-motion";
import {
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

const SOL_ADDRESS =
  process.env.NEXT_PUBLIC_RECEIVER_SOL ||
  "3ZcY5PFeg9RacH6ZDCrSXfKj4GD2xEunR6RYVjtTZ8Ft";

function solscanTxUrl(txid: string) {
  if (!txid) return "#";
  return `https://solscan.io/tx/${txid}`;
}

function solscanAddressUrl(address: string) {
  if (!address) return "#";
  return `https://solscan.io/account/${address}`;
}

type WallMessage = {
  _id: string;
  wallet: string;
  amount: number;
  txHash: string;
  message: string;
  imageUrl?: string;
  createdAt: string;
  funEffect?: string;
};

type ClassementUser = { wallet: string; score: number };

function getClassements(wall: WallMessage[]) {
  const globalMap = new Map<string, number>();
  const todayMap = new Map<string, number>();
  const today = new Date().toISOString().slice(0, 10);
  for (const msg of wall) {
    globalMap.set(msg.wallet, (globalMap.get(msg.wallet) || 0) + msg.amount);
    if (msg.createdAt.slice(0, 10) === today) {
      todayMap.set(msg.wallet, (todayMap.get(msg.wallet) || 0) + msg.amount);
    }
  }
  const classementGlobal: ClassementUser[] = Array.from(
    globalMap,
    ([wallet, score]) => ({ wallet, score })
  ).sort((a, b) => b.score - a.score);
  const classementJour: ClassementUser[] = Array.from(
    todayMap,
    ([wallet, score]) => ({ wallet, score })
  ).sort((a, b) => b.score - a.score);
  return { classementGlobal, classementJour };
}

export default function FlexWallPage() {
  const { wallet } = useWallet();
  const [amount, setAmount] = useState(0);
  const [message, setMessage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [wall, setWall] = useState<WallMessage[]>([]);
  const [loadingWall, setLoadingWall] = useState(false);
  const [txHash, setTxHash] = useState<string>("");
  const [modalOpen, setModalOpen] = useState(false);
  const [funEffect, setFunEffect] = useState("");

  // Fetch messages from API
  const fetchWall = async () => {
    setLoadingWall(true);
    try {
      const res = await fetch("/api/messages");
      if (res.ok) {
        const data = await res.json();
        setWall(data);
      }
    } catch {}
    setLoadingWall(false);
  };

  useEffect(() => {
    fetchWall();
  }, []);

  // Pay in SOL
  const handlePay = async () => {
    setError("");
    setSuccess("");
    try {
      const txHashSol = await payWithPhantom();
      if (txHashSol) {
        setTxHash(txHashSol);
        setSuccess("SOL payment successful!");
      } else {
        setError("Solana payment cancelled or failed");
      }
    } catch (e) {
      if (e instanceof Error) setError(e.message || "Payment error");
      else setError("Payment error");
    }
  };

  interface PhantomProvider {
    isPhantom?: boolean;
    connect: () => Promise<{ publicKey: { toString(): string } }>;
    signTransaction?: (tx: Transaction) => Promise<Transaction>;
    signAndSendTransaction?: (
      tx: Transaction
    ) => Promise<{ signature: string }>;
  }

  async function payWithPhantom(): Promise<string | null> {
    const phantom = window.solana as PhantomProvider;
    if (!phantom) {
      setError("Phantom Wallet not detected");
      return null;
    }
    try {
      const resp = await phantom.connect();
      const fromPubkey = new PublicKey(resp.publicKey.toString());
      const toPubkey = new PublicKey(SOL_ADDRESS);
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey,
          toPubkey,
          lamports: Math.round(amount * LAMPORTS_PER_SOL),
        })
      );
      // fetch latest blockhash from server-side endpoint to avoid browser RPC 403 on some providers
      const bhResp = await fetch("/api/solana/blockhash");
      if (!bhResp.ok)
        throw new Error("Failed to get latest blockhash from server");
      const bhJson = await bhResp.json();
      transaction.recentBlockhash = bhJson.blockhash;
      transaction.feePayer = fromPubkey;
      if (typeof phantom.signAndSendTransaction === "function") {
        const { signature } = await phantom.signAndSendTransaction(transaction);
        // returning the signature; server or UI can confirm it later if needed
        return signature;
      }
      if (typeof phantom.signTransaction === "function") {
        const signed = await phantom.signTransaction(transaction);
        const raw = signed.serialize();
        // If wallet doesn't provide signAndSend, some wallets return a signed tx to be submitted.
        // We'll return the base64 of the signed tx for the backend to submit if desired.
        return Buffer.from(raw).toString("base64");
      }
      setError("Phantom Wallet does not support transaction signing.");
      return null;
    } catch (err) {
      setError(
        "Solana payment error: " + (err instanceof Error ? err.message : "")
      );
      return null;
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!txHash) {
      setError("Payment must be completed before posting.");
      return;
    }
    setSending(true);
    setSuccess("");
    setError("");
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wallet,
          amount,
          txHash,
          message,
          imageUrl,
          funEffect,
        }),
      });
      if (res.ok) {
        setSuccess("Message posted!");
        setAmount(0);
        setImageUrl("");
        setTxHash("");
        setMessage("");
        setFunEffect("");
        fetchWall();
      } else {
        const data = await res.json();
        setError(data.error || "Error sending message.");
      }
    } finally {
      setSending(false);
    }
  };

  const { classementGlobal, classementJour } = getClassements(wall);

  return (
    <div className="font-sans min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 dark:from-zinc-900 dark:via-zinc-950 dark:to-blue-950 flex flex-col">
      <Header>
        {wallet && (
          <button
            className="ml-4 px-5 py-2 rounded-2xl font-bold text-blue-100 bg-white/60 dark:bg-zinc-800/60 border border-blue-200/40 dark:border-blue-900/30 shadow-md backdrop-blur-md transition-all duration-200 hover:scale-[1.07] hover:shadow-xl hover:bg-blue-50/80 dark:hover:bg-blue-900/60"
            onClick={() => setModalOpen(true)}
          >
            Post on the FlexWall
          </button>
        )}
      </Header>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 w-full max-w-md mx-auto bg-white/80 dark:bg-zinc-900/80 p-6 rounded-2xl shadow-2xl border border-blue-100 dark:border-blue-900"
        >
          <h2 className="text-2xl font-bold text-center mb-2 text-blue-700 dark:text-blue-300">
            Post on the FlexWall
          </h2>
          <label className="font-semibold">
            Amount (SOL):
            <input
              type="number"
              min={0}
              step={0.0001}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="block w-full mt-1 p-2 rounded border"
              required
            />
          </label>
          <button
            type="button"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-60"
            disabled={sending || amount <= 0 || !!txHash}
            onClick={handlePay}
          >
            {txHash
              ? `Payment confirmed (${txHash.slice(0, 8)}...)`
              : `Pay in SOL`}
          </button>
          <label className="font-semibold">
            Message to display:
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="block w-full mt-1 p-2 rounded border"
              maxLength={200}
              required
              disabled={!txHash}
            />
          </label>
          <label className="font-semibold">
            Image/GIF (URL, optional):
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="block w-full mt-1 p-2 rounded border"
              placeholder="https://..."
              disabled={!txHash}
            />
          </label>
          {txHash && amount >= 0.5 && (
            <FunEffectSelector
              amount={amount}
              funEffect={funEffect}
              setFunEffect={setFunEffect}
            />
          )}
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded disabled:opacity-60"
            disabled={sending || !txHash}
          >
            {sending ? "Sending..." : "Post on the FlexWall"}
          </button>
          {success && (
            <div className="text-emerald-700 font-semibold">{success}</div>
          )}
          {error && <div className="text-red-600 font-semibold">{error}</div>}
        </form>
      </Modal>

      <main className="flex flex-col gap-12 items-center w-full max-w-7xl mx-auto px-2 sm:px-6 py-8">
        <Classement
          classementGlobal={classementGlobal}
          classementJour={classementJour}
        />

        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
        >
          <div className="w-full">
            <h2 className="text-3xl font-bold mb-8 text-center text-blue-900 dark:text-blue-100 drop-shadow">
              FlexWall (Solana)
            </h2>
            {loadingWall ? (
              <div>Loading wall...</div>
            ) : wall.length === 0 ? (
              <div className="text-gray-500 text-center py-12 text-xl">
                No messages on the wall yet.
              </div>
            ) : (
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                <AnimatePresence initial={false}>
                  {wall.map((msg) => (
                    <WallMessageCard
                      key={msg._id}
                      msg={msg}
                      topWallet={classementGlobal[0]?.wallet}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </motion.section>
      </main>
    </div>
  );
}

// Fun Effect Selector Component
function FunEffectSelector({
  amount,
  funEffect,
  setFunEffect,
}: {
  amount: number;
  funEffect: string;
  setFunEffect: (v: string) => void;
}) {
  const options = [
    { value: "confetti", label: "🎉 Confetti", min: 0.5 },
    { value: "flame", label: "🔥 Flame", min: 1 },
    { value: "diamond", label: "💎 Diamond", min: 2 },
    { value: "crown", label: "👑 Crown", min: 3 },
    { value: "rocket", label: "🚀 Rocket", min: 5 },
  ];
  const available = options.filter((opt) => amount >= opt.min);
  if (available.length === 0) return null;
  return (
    <div className="flex flex-col gap-2">
      <label className="font-semibold">Fun effect unlocked:</label>
      <div className="flex flex-wrap gap-2">
        {available.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={`px-3 py-2 rounded-xl text-lg font-bold border-2 transition shadow-sm ${
              funEffect === opt.value
                ? "bg-blue-600 text-white border-blue-700"
                : "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 border-blue-200 dark:border-blue-800 hover:bg-blue-200 dark:hover:bg-blue-800"
            }`}
            onClick={() => setFunEffect(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// Wall Message Card Component
function WallMessageCard({
  msg,
  topWallet,
}: {
  msg: WallMessage;
  topWallet?: string;
}) {
  const isTop1 = msg.wallet === topWallet;

  let funEffectNode: React.ReactNode = null;
  switch (msg.funEffect) {
    case "confetti":
      funEffectNode = (
        <span className="absolute left-1/2 -translate-x-1/2 -top-7 text-3xl animate-bounce select-none">
          🎉
        </span>
      );
      break;
    case "flame":
      funEffectNode = (
        <span className="absolute right-4 top-4 text-2xl animate-pulse select-none">
          🔥
        </span>
      );
      break;
    case "diamond":
      funEffectNode = (
        <span className="absolute left-4 bottom-4 text-2xl animate-spin-slow select-none">
          💎
        </span>
      );
      break;
    case "crown":
      funEffectNode = (
        <span className="absolute left-1/2 -translate-x-1/2 -top-8 text-4xl animate-bounce select-none">
          👑
        </span>
      );
      break;
    case "rocket":
      funEffectNode = (
        <span className="absolute right-4 bottom-4 text-2xl animate-rocket select-none">
          🚀
        </span>
      );
      break;
  }

  const imageSrc = typeof msg.imageUrl === "string" ? msg.imageUrl : undefined;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3, type: "spring" }}
      style={{
        width: "100%",
        minHeight: 180,
        maxHeight: 260,
        borderRadius: "0.6rem",
        border: isTop1 ? "2.5px solid #00FFD0" : "1.2px solid #334155",
        background: isTop1
          ? "linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%)"
          : "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
        boxShadow: isTop1
          ? "0 0 0 3px #00FFD0, 0 4px 16px 0 #00FFD055"
          : "0 1px 6px 0 #222b3a22",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        gap: "0.4rem",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        padding: "0.7rem 0.7rem 0.5rem 0.7rem",
        cursor: "default",
      }}
    >
      {isTop1 && (
        <span
          className="relative -top-2 left-1/2 -translate-x-1/2 px-2 py-1 rounded-full bg-[#00FFD0] text-[#1e293b] font-bold shadow-lg z-20 select-none text-xs border border-[#fff]"
          style={{ textShadow: "0 1px 6px #fff" }}
        >
          👑 TOP 1 OF THE WALL
        </span>
      )}
      <div className="flex items-center gap-2 mb-1 min-w-0 relative z-10">
        <a
          href={solscanAddressUrl(msg.wallet)}
          target="_blank"
          rel="noopener noreferrer"
          title={msg.wallet}
          className="font-mono text-xs text-blue-900 dark:text-blue-100 bg-white/80 dark:bg-zinc-900/80 px-2 py-1 rounded truncate max-w-[120px] inline-block"
        >
          {msg.wallet.slice(0, 6)}...{msg.wallet.slice(-4)}
        </a>
        <span
          className={`ml-auto font-bold text-base flex items-center gap-1 ${
            isTop1
              ? "text-[#1e293b] drop-shadow-lg"
              : "text-blue-100 dark:text-blue-100"
          }`}
        >
          {msg.amount.toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 4,
          })}
          <span className="text-xs font-semibold ml-1">◎</span>
        </span>
      </div>
      <div
        style={{
          color: isTop1 ? "#1e293b" : "#dbeafe",
          fontWeight: 600,
          wordBreak: "break-word",
          zIndex: 10,
          fontSize: "0.93em",
          marginBottom: msg.imageUrl ? 8 : 0,
        }}
      >
        {msg.message}
      </div>
      {imageSrc && (
        <Image
          src={imageSrc}
          alt="Wall image"
          className="rounded-xl border-2 border-blue-200 shadow-lg"
          width={180}
          height={180}
          style={{
            objectFit: "contain",
            maxHeight: 180,
            maxWidth: "90%",
            background: "#fff8",
            padding: "0.3rem",
          }}
          unoptimized
        />
      )}
      <div className="flex items-center justify-between mt-auto text-xs text-gray-400 relative z-10">
        {msg.txHash ? (
          <a
            href={solscanTxUrl(msg.txHash)}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-blue-600"
          >
            {msg.txHash.slice(0, 12)}...
          </a>
        ) : (
          <span>-</span>
        )}
        <span>{new Date(msg.createdAt).toLocaleString()}</span>
      </div>
      {funEffectNode}
    </motion.div>
  );
}
