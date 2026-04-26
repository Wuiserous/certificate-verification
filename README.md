# Certificate Verification Website

This is a separate Next.js verification site for the certificate generator project.

## What it does

- accepts the QR contract used by the desktop app
- supports:
  - `certificate`
  - `batch`
  - `file`
- derives the Cloudflare R2 object path for the uploaded PDF
- shows a direct download button when your public R2 base URL is configured

## Environment variables

Copy `.env.example` and set:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_BRAND_NAME`
- `NEXT_PUBLIC_ISSUER_NAME`
- `NEXT_PUBLIC_R2_PUBLIC_BASE_URL`

Example:

```env
NEXT_PUBLIC_SITE_URL=https://your-verification-site.vercel.app
NEXT_PUBLIC_BRAND_NAME=Persevex CertiCheck
NEXT_PUBLIC_ISSUER_NAME=Persevex
NEXT_PUBLIC_R2_PUBLIC_BASE_URL=https://pub-your-bucket.example.com
```

## Routes

- `/`
- `/verify?certificate=<uuid>&batch=<batch>&file=<file>`
- `/api/verify?certificate=<uuid>&batch=<batch>&file=<file>`

## Notes

- this is intentionally separate from `certificateGeneratorV3.py`
- it is built for the current direct-file Cloudflare R2 contract
- later you can add token signing, metadata lookup, or a database-backed verification flow
