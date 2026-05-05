# Field Reports Submission Form

A custom multi-step web form for collecting submissions from facilitators interested in giving a Field Report at New Stadium. Built as a standalone static site intended to be deployed at fieldreports.newsystems.ca.

## How it works

1. Submitter fills out a 2-step form (Contact > Work)
2. On submit, data posts to a Google Apps Script endpoint
3. The script appends a row to a Google Sheet, sends a confirmation email to the submitter, and sends a formatted notification to stadium@newsystems.ca
4. Submitter sees a confirmation screen

## Stack

- **Frontend:** Static HTML, CSS, JS (no framework, no build step)
- **Backend:** Google Apps Script (Web App deployment)
- **Data store:** Google Sheet
- **Hosting:** Netlify, auto-deploys from `main` branch
- **Domain:** fieldreports.newsystems.ca (CNAME to Netlify)
- **Font:** Inter via Google Fonts CDN

## File structure

```
field-reports/
  index.html          # The form (3 steps: Contact, Work, Confirmation)
  style.css           # All styles (Inter, proportional inputs, mobile responsive)
  form.js             # Form logic (validation, navigation, submission, auto-expand textareas)
  netlify.toml        # Netlify deploy config + security headers
  apps-script/
    Code.gs           # Google Apps Script (paste into Script editor, not deployed from here)
  DEPLOY.md           # Step-by-step deploy instructions
  CLAUDE.md           # Claude Code project guide
  README.md           # This file
```

## Form fields

**Step 1: Contact Information**
- First name, Last name, Email (required)
- Twitter, Instagram, Personal website/portfolio, Phone, Company/Organization, Referral Source (optional)
- Includes preface defining "Field Report" with CTA

**Step 2: Work**
Preface paragraph (definition of field research) followed by:
1. Fundamental question driving research/practice/work (required)
2. Methods/tools/frameworks used to investigate (required)
3. Links to work or documentation (required; CTA to email cairo@newsystems.ca for attachments)
4. Ideal Field Report experience from start to finish (required)
5. What people will learn (required)
6. Direct outcomes and potential side-effects (required)
7. Anything else (optional)

**Step 3: Confirmation**
- On-screen confirmation with email notice

## Google Sheet columns

Timestamp, Submission ID, First Name, Last Name, Email, Phone, Twitter, Instagram, Website, Company/Organization, Referral Source, Driving Question, Methods / Tools, Links, Ideal Format/Experience, What People Will Learn, Outcomes & Side-Effects, Anything Else, Status, Notes, Source

## Security

- CSRF token validation on the backend (`ns-fieldreports-2026`)
- Per-email rate limiting (5 min cooldown)
- Global rate limiting (50 submissions/hour)
- Server-side input validation and field truncation (5000 char max)
- All frontend inputs have `maxlength` attributes
- HTML team notification with escaping on every interpolated field
- `noscript` fallback for JS-disabled browsers
- Netlify security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy)

## Emails

Emails are sent from the Google account that deployed the Apps Script. The confirmation email reply-to is set to stadium@newsystems.ca.

- **To submitter:** "New Stadium: Field Report Submission Received" — multi-line confirmation
- **To stadium@newsystems.ca:** "New Field Report: {Name}" — formatted HTML summary with all submission data plus plain-text fallback

## Making changes

1. Edit files locally
2. Commit and push to `main`
3. Netlify auto-deploys within seconds

To update the Apps Script backend:
1. Edit `apps-script/Code.gs` locally
2. Copy the contents
3. Paste into the Apps Script editor (Extensions > Apps Script from the Google Sheet)
4. Deploy > Manage deployments > Edit > New version > Deploy
