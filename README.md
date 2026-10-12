# CNG Deal Desk (illustrative demo)

A five-step walkthrough of a controlled maize buyer-to-supply path: buyer requirement, supply, evidence, approval, reconciliation. All names and numbers are illustrative.

Built with TanStack Start, React 19, Tailwind v4 and Nitro.

## Run locally

    npm install
    npm run dev      # http://localhost:8080

## Deploy (GitHub Pages, all on GitHub)

1. Push this repo to GitHub (branch `main`).
2. Repo **Settings > Pages > Source: GitHub Actions**.
3. Every push to `main` runs `.github/workflows/deploy-pages.yml` and publishes the site.

Your address is `https://USERNAME.github.io/REPO/` (or `https://USERNAME.github.io/` if the repo is named `USERNAME.github.io`).

The same code also builds for Netlify (`netlify.toml`) and Vercel (`vercel.json`). No database or sign-in is used, so no environment variables are required.

## Checks

    npm run typecheck && npm test && npm run build
