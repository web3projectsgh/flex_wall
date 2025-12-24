// Connexion Phantom (Solana) strictement typée

declare global {
  interface PhantomProvider {
    isPhantom?: boolean;
    connect: (opts?: {
      onlyIfTrusted: boolean;
    }) => Promise<{ publicKey: { toString(): string } }>;
    disconnect?: () => Promise<void>;
    signTransaction: (
      transaction: import("@solana/web3.js").Transaction
    ) => Promise<import("@solana/web3.js").Transaction>;
    signAndSendTransaction?: (
      transaction: import("@solana/web3.js").Transaction
    ) => Promise<{ signature: string }>;
  }
  interface Window {
    solana?: PhantomProvider;
  }
}

export async function connectPhantom(): Promise<string | null> {
  if (typeof window === "undefined" || !window.solana) {
    alert("Phantom Wallet n'est pas installé.");
    return null;
  }
  try {
    const resp = await window.solana.connect();
    return resp.publicKey.toString();
  } catch {
    alert("Connexion au wallet Phantom refusée.");
    return null;
  }
}
