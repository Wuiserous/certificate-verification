import { normalizeVerificationInput } from "@/lib/verification";

const brandName = process.env.NEXT_PUBLIC_BRAND_NAME || "Persevex CertiCheck";
const issuerName = process.env.NEXT_PUBLIC_ISSUER_NAME || "Persevex";

export async function generateMetadata({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const data = normalizeVerificationInput(resolvedSearchParams);
  return {
    title: data.isValid ? `Verified Certificate | ${brandName}` : `Invalid Verification Link | ${brandName}`,
    description: "Certificate verification and direct download."
  };
}

export default async function VerifyPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const verification = normalizeVerificationInput(resolvedSearchParams);

  return (
    <main className="page-shell">
      <div className="page-frame">
        <section className="hero-card">
          <div className="hero-row">
            <div>
              <div className="eyebrow">Official Verification</div>
              <h1 className="page-title">{brandName}</h1>
              <p className="page-copy">
                This page validates the certificate link structure and prepares a direct cloud download for the exact
                file uploaded by your desktop application.
              </p>
            </div>
            <div className="brand-chip">
              <strong>{issuerName}</strong>
              <span>Verification page for recipient scans and instant certificate access.</span>
            </div>
          </div>
        </section>

        <section className="two-col">
          <article className="status-card">
            <div className={`status-badge ${verification.isValid ? "valid" : "invalid"}`}>
              {verification.isValid ? "Verification Link Accepted" : "Verification Link Incomplete"}
            </div>
            <h2 className="section-title">{verification.isValid ? "Certificate link parsed successfully" : "Missing required verification fields"}</h2>
            <p className="section-copy">
              {verification.isValid
                ? "The QR payload includes the certificate UUID, batch, and file. Once your cloud URL is configured, recipients can download the exact PDF from here."
                : `This link is missing: ${verification.missing.join(", ")}.`}
            </p>

            <div className="info-grid">
              <div className="info-row">
                <span className="info-label">Certificate UUID</span>
                <span className="info-value">{verification.certificate || "Not provided"}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Batch</span>
                <span className="info-value">{verification.batch || "Not provided"}</span>
              </div>
              <div className="info-row">
                <span className="info-label">File</span>
                <span className="info-value">{verification.file || "Not provided"}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Cloud Object Path</span>
                <span className="info-value">{verification.objectPath || "Not available"}</span>
              </div>
            </div>
          </article>

          <aside className="meta-card">
            <h2 className="section-title">Recipient actions</h2>
            <p className="section-copy">
              The download button becomes live as soon as you configure a public base URL for your R2 bucket or custom
              domain in Vercel.
            </p>

            <div className="download-stack">
              {verification.isValid && verification.downloadUrl ? (
                <a className="cta" href={verification.downloadUrl} target="_blank" rel="noreferrer">
                  Download Certificate PDF
                </a>
              ) : (
                <div className="notice">
                  {verification.isValid
                    ? "Set NEXT_PUBLIC_R2_PUBLIC_BASE_URL in Vercel to enable direct certificate downloads from this page."
                    : "Fix the QR query parameters first. The page needs certificate, batch, and file to resolve the PDF."}
                </div>
              )}
              <a className="cta secondary" href="/">
                Back to Portal Home
              </a>
            </div>

            <span className="code-block">
              {verification.downloadUrl || "NEXT_PUBLIC_R2_PUBLIC_BASE_URL is not configured yet."}
            </span>
          </aside>
        </section>

        <p className="footer-note">
          This first version is intentionally simple: it trusts the QR contract and maps it directly to cloud file
          storage. Add token signing or a database later for stronger trust and richer metadata.
        </p>
      </div>
    </main>
  );
}
