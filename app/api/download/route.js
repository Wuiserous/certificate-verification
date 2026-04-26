import { NextResponse } from "next/server";
import { normalizeVerificationInput } from "@/lib/verification";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const verification = normalizeVerificationInput(Object.fromEntries(searchParams.entries()));

  if (!verification.isValid) {
    return NextResponse.json(
      {
        ok: false,
        error: `Missing required query fields: ${verification.missing.join(", ")}`
      },
      { status: 400 }
    );
  }

  if (!verification.downloadUrl) {
    return NextResponse.json(
      {
        ok: false,
        error: "NEXT_PUBLIC_R2_PUBLIC_BASE_URL is not configured."
      },
      { status: 500 }
    );
  }

  const upstream = await fetch(verification.downloadUrl, {
    cache: "no-store"
  });

  if (!upstream.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: `Upstream certificate fetch failed with status ${upstream.status}.`
      },
      { status: upstream.status }
    );
  }

  const contentType = upstream.headers.get("content-type") || "application/pdf";
  const fileName = verification.file || "certificate.pdf";

  return new NextResponse(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${fileName.replace(/"/g, "")}"`,
      "Cache-Control": "no-store"
    }
  });
}
