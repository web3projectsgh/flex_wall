import { ethers } from "ethers";
// Typage déjà global dans le projet, mais on le remet ici si besoin :
interface EthereumProvider {
  isMetaMask?: boolean;
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
}
declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

export async function connectWallet(): Promise<string | null> {
  if (typeof window === "undefined" || !window.ethereum) {
    alert("MetaMask n'est pas installé.");
    return null;
  }
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts: string[] = await provider.send("eth_requestAccounts", []);
    return accounts[0];
  } catch {
    alert("Connexion au wallet refusée.");
    return null;
  }
}
