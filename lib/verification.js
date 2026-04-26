export function sanitizeStorageSegment(value) {
  const cleaned = String(value || "").trim().replace(/[^a-zA-Z0-9._/-]+/g, "-");
  return cleaned.replace(/^[./-]+|[./-]+$/g, "") || "item";
}

export function buildCloudObjectPath(batch, file) {
  const batchSegment = sanitizeStorageSegment(batch);
  const fileSegment = sanitizeStorageSegment(file);
  return `certificate-batches/${batchSegment}/files/${fileSegment}`;
}

export function buildDownloadUrl(batch, file) {
  const base = (process.env.NEXT_PUBLIC_R2_PUBLIC_BASE_URL || "").trim().replace(/\/$/, "");
  if (!base) {
    return "";
  }
  const objectPath = buildCloudObjectPath(batch, file)
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  return `${base}/${objectPath}`;
}

export function normalizeVerificationInput(searchParams = {}) {
  const certificate = String(searchParams.certificate || "").trim();
  const batch = String(searchParams.batch || "").trim();
  const file = String(searchParams.file || "").trim();
  const missing = [];

  if (!certificate) missing.push("certificate");
  if (!batch) missing.push("batch");
  if (!file) missing.push("file");

  const objectPath = batch && file ? buildCloudObjectPath(batch, file) : "";
  const downloadUrl = batch && file ? buildDownloadUrl(batch, file) : "";

  return {
    certificate,
    batch,
    file,
    missing,
    objectPath,
    downloadUrl,
    isValid: missing.length === 0
  };
}
