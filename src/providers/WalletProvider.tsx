"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { connectPhantom } from "../utils/connectPhantom";

type WalletContextType = {
  wallet: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  loading: boolean;
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Connexion Phantom
  const connect = async () => {
    setLoading(true);
    const pubkey = await connectPhantom();
    setWallet(pubkey);
    setLoading(false);
  };

  // Déconnexion Phantom
  const disconnect = () => {
    if (window.solana && typeof window.solana.disconnect === "function") {
      window.solana.disconnect();
    }
    setWallet(null);
  };

  // Reconnexion auto si déjà connecté
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.solana &&
      window.solana.isPhantom
    ) {
      window.solana
        .connect({ onlyIfTrusted: true })
        .then((resp) => setWallet(resp.publicKey.toString()))
        .catch(() => setWallet(null));
    }
  }, []);

  return (
    <WalletContext.Provider value={{ wallet, connect, disconnect, loading }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx)
    throw new Error("useWallet doit être utilisé dans un WalletProvider");
  return ctx;
}
