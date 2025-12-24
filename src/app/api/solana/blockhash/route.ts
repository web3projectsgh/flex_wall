import { NextResponse } from "next/server";
import { Connection } from "@solana/web3.js";

function getRpcUrl() {
  // Allow overriding with a full URL env var (useful for paid RPC providers)
  if (process.env.NEXT_PUBLIC_SOLANA_RPC_URL)
    return process.env.NEXT_PUBLIC_SOLANA_RPC_URL;
  return "https://api.mainnet-beta.solana.com";
}

export async function GET() {
  try {
    const connection = new Connection(getRpcUrl());
    const { blockhash } = await connection.getLatestBlockhash();
    return NextResponse.json({ blockhash });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message || "Failed to fetch blockhash" },
      { status: 502 }
    );
  }
}
