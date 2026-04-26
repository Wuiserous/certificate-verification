import { buildVerificationQuery, normalizeVerificationInput } from "@/lib/verification";

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
  const directDownloadPath = verification.isValid ? `/api/download?${buildVerificationQuery(verification)}` : "";
  const inlinePreviewUrl = verification.downloadUrl;

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

        <section className="panel-card certificate-stage">
          <div className="section-kicker">Certificate Preview</div>
          <div className="preview-shell">
            {verification.isValid && inlinePreviewUrl ? (
              <iframe
                title="Certificate preview"
                src={inlinePreviewUrl}
                className="certificate-frame"
              />
            ) : (
              <div className="preview-empty">
                {verification.isValid
                  ? "Set NEXT_PUBLIC_R2_PUBLIC_BASE_URL in Vercel to preview the uploaded PDF here."
                  : "This verification link is incomplete, so the certificate preview cannot be shown yet."}
              </div>
            )}
          </div>
        </section>

        <section className="two-col verify-layout">
          <article className="status-card">
            <div className={`status-badge ${verification.isValid ? "valid" : "invalid"}`}>
              {verification.isValid ? "Certificate Located" : "Verification Link Incomplete"}
            </div>
            <h2 className="section-title">{verification.isValid ? "Certificate details" : "Missing required verification fields"}</h2>
            <p className="section-copy">
              {verification.isValid
                ? "This certificate link includes the core lookup fields required to resolve the cloud-stored PDF."
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
              Use the download button to save the exact PDF locally. The preview above is for viewing only.
            </p>

            <div className="download-stack">
              {verification.isValid && verification.downloadUrl ? (
                <>
                  <a className="cta" href={directDownloadPath}>
                    Download Certificate
                  </a>
                  <a className="cta secondary" href={verification.downloadUrl} target="_blank" rel="noreferrer">
                    Open Original PDF
                  </a>
                </>
              ) : (
                <div className="notice">
                  {verification.isValid
                    ? "Set NEXT_PUBLIC_R2_PUBLIC_BASE_URL in Vercel to enable the preview and download actions."
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
