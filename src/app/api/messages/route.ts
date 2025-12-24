import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../../../utils/mongodb";
import { Db, Collection } from "mongodb";

const _0x1a2b = (s: string): string => Buffer.from(s, "base64").toString();
const _0x7g8h = (c: Db, f: string): Collection => c.collection(_0x1a2b(f));

export async function GET(request: NextRequest) {
  try {
    const g = await clientPromise;
    const h = g.db();
    const i = await _0x7g8h(h, "bWVzc2FnZXM=")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    return NextResponse.json(i);
  } catch {
    return NextResponse.json(
      {
        error: _0x1a2b(
          "RXJyZXVyIGxvcnMgZGUgbGEgcsOpY3Vww6lyYXRpb24gZGVzIG1lc3NhZ2VzLg=="
        ),
      },
      { status: 500 }
    );
  }
}
export async function POST(req: NextRequest) {
  try {
    const { wallet, amount, message, imageUrl, funEffect } = await req.json();
    if (!wallet || !amount || !message) {
      return NextResponse.json({ error: "Champs manquants." }, { status: 400 });
    }

    // Définition des effets autorisés selon le montant
    const funEffects = [
      { value: "confetti", min: 0.5 },
      { value: "flame", min: 1 },
      { value: "diamond", min: 2 },
      { value: "crown", min: 3 },
      { value: "rocket", min: 5 },
    ];
    let funEffectToSave = null;
    if (funEffect) {
      const found = funEffects.find(
        (e) => e.value === funEffect && amount >= e.min
      );
      if (found) {
        funEffectToSave = funEffect;
      } else {
        return NextResponse.json(
          { error: "Effet fun non autorisé pour ce montant." },
          { status: 400 }
        );
      }
    }

    const client = await clientPromise;
    const db = client.db();
    const doc = {
      wallet,
      amount,
      message,
      imageUrl: imageUrl || null,
      funEffect: funEffectToSave,
      createdAt: new Date(),
    };
    await db.collection("messages").insertOne(doc);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de l'envoi du message." },
      { status: 500 }
    );
  }
}
