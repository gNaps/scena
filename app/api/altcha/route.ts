import { createChallenge } from "@/lib/altcha";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const challenge = createChallenge();
    return NextResponse.json(challenge);
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
