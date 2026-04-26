import { NextResponse } from "next/server";
import { normalizeVerificationInput } from "@/lib/verification";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const data = normalizeVerificationInput(Object.fromEntries(searchParams.entries()));

  return NextResponse.json(
    {
      ok: data.isValid,
      brand: process.env.NEXT_PUBLIC_BRAND_NAME || "Persevex CertiCheck",
      issuer: process.env.NEXT_PUBLIC_ISSUER_NAME || "Persevex",
      verification: data
    },
    { status: data.isValid ? 200 : 400 }
  );
}
