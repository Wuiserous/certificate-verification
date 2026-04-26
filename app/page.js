const brandName = process.env.NEXT_PUBLIC_BRAND_NAME || "Persevex CertiCheck";
const issuerName = process.env.NEXT_PUBLIC_ISSUER_NAME || "Persevex";

export default function HomePage() {
  return (
    <main className="page-shell">
      <div className="page-frame">
        <section className="hero-card">
          <div className="hero-row">
            <div>
              <div className="eyebrow">Verification Portal</div>
              <h1 className="page-title">{brandName}</h1>
              <p className="page-copy">
                This site validates certificate QR links and lets recipients download the exact cloud-stored PDF.
                It is built to match the current desktop generator contract: <code>certificate</code>, <code>batch</code>,
                and <code>file</code>.
              </p>
            </div>
            <div className="brand-chip">
              <strong>{issuerName}</strong>
              <span>Cloud-backed certificate verification with direct download readiness.</span>
            </div>
          </div>
        </section>

        <section className="two-col">
          <article className="panel-card">
            <h2 className="section-title">How it works</h2>
            <p className="section-copy">
              A valid QR link opens the verification page with the certificate identifier, batch name, and filename.
              The app then derives the cloud file path and exposes a direct download button when your R2 public base URL
              is configured.
            </p>
            <span className="code-block">
              /verify?certificate=&lt;uuid&gt;&amp;batch=&lt;batch-name&gt;&amp;file=&lt;file-name&gt;
            </span>
          </article>

          <article className="meta-card">
            <h2 className="section-title">Next step</h2>
            <p className="section-copy">
              Open the verification route directly or scan a real QR from the desktop app after setting the verification
              URL in your generator settings.
            </p>
            <div className="download-stack">
              <a className="cta" href="/verify?certificate=demo-uuid&batch=demo-batch&file=Demo%20Certificate.pdf">
                Open Demo Verification
              </a>
              <a className="cta secondary" href="/api/verify?certificate=demo-uuid&batch=demo-batch&file=Demo%20Certificate.pdf">
                View Demo API Response
              </a>
            </div>
          </article>
        </section>

        <p className="footer-note">
          Keep this site deployed separately from the desktop generator. It only needs the QR contract and your R2
          public base URL.
        </p>
      </div>
    </main>
  );
}
