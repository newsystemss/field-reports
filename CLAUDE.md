# Claude Code Project Guide: Field Reports

## Overview

Custom submission form for facilitators interested in giving a Field Report at New Stadium. Static HTML/CSS/JS frontend posting to a Google Apps Script backend. Intended to be deployed at fieldreports.newsystems.ca via Netlify.

Forked from `new-casting-call` (sibling project) on 2026-05-05. Same design system, same architecture, different Step 2 questions and copy. Email flow follows the `new-stadium-brief` convention (sends to stadium@newsystems.ca with the longer multi-line confirmation body).

## Architecture

```
Browser (fieldreports.newsystems.ca)
  |
  | POST (JSON, text/plain content-type)
  v
Google Apps Script (Web App)
  |
  |--- Append row to Google Sheet
  |--- Send confirmation email to submitter
  |--- Send notification email to stadium@newsystems.ca
```

No build step. No framework. Three files serve the entire frontend.

## Key Files

| File | Purpose | When to modify |
|------|---------|----------------|
| `index.html` | Form structure, field definitions, progress nav, intro text | Adding/removing/reordering questions, copy edits |
| `style.css` | All styles, responsive breakpoints, animations | Visual changes, spacing, colors |
| `form.js` | Validation, step navigation, submission logic, textarea auto-expand | Changing form behavior, adding fields to payload |
| `apps-script/Code.gs` | Backend: Sheet append, email sending, rate limiting, validation | Changing email content, adding Sheet columns, adjusting rate limits |
| `netlify.toml` | Deploy config, security headers | Changing redirects or headers |

## Form structure

**Step 1 (Contact):** firstName, lastName, email (required); twitter, instagram, website, phone, company, referral (optional). Includes preface paragraph defining "Field Report" with CTA.

**Step 2 (Work):** Preface paragraph (definition of field research) followed by 7 questions:
1. `question` (required) - fundamental question driving research/practice/work
2. `methods` (required) - tools, frameworks, exercises, methods used
3. `links` (required) - links to work or documentation; CTA to email cairo@newsystems.ca for attachments
4. `format` (required) - ideal experience from start to finish
5. `learnings` (required) - what people will learn
6. `outcomes` (required) - direct outcomes and potential side-effects
7. `other` (optional) - anything else

**Step 3:** Confirmation.

## Adding a new form field

1. Add the HTML in `index.html` (inside the appropriate `form-step` section)
2. Add a `maxlength` attribute
3. In `form.js`, add the field to the `data` object in the submit handler
4. In `apps-script/Code.gs`:
   - Add the field to the `appendRow` call (maintain column order)
   - Add to `required` array if mandatory
   - Update the team notification email template (HTML + plain-text)
   - Update `setupSheet()` headers array and the `sheet.getRange(1, 1, 1, N)` width
   - Update `STATUS_COLUMN` if the new field shifts the Status column
5. Manually add the column header to the existing Sheet, or re-run `setupSheet()` on a fresh Sheet
6. Redeploy both the frontend (git push) and the Apps Script (paste + new version)

## Design System

- **Font:** Inter (weight 400 body, 500 headings, 14px base)
- **Colors:** `--bg: #fafafa`, `--text: #343c3c`, `--text-muted: #5e6666`, `--accent: #abb495`, `--error: #8b3a3a`
- **Layout:** Pinned top-left, max-width 680px
- **Inputs:** Bottom-border only, proportional widths (short 160px, medium 260px, long full-width textarea)
- **Buttons:** Styled as underlined text links, not boxed
- **Transitions:** 150ms ease fade between steps
- **Mobile breakpoint:** 600px (all inputs go full-width)
- **Form intro:** `.form-intro` class, 60ch max-width, muted color

## Backend Details

- **Apps Script URL:** Hardcoded in `form.js` line 1 (empty until deployed)
- **CSRF token:** `ns-fieldreports-2026` (must match between `form.js` and `Code.gs`)
- **Submission ID prefix:** `FR-`
- **Source tag:** `fieldreports.newsystems.ca`
- **Rate limits:** 5 min cooldown per email, 50 submissions/hour global
- **Field truncation:** 5000 chars max per field (server-side)
- **Emails sent from:** the Google account that deployed the Apps Script
- **Team notifications go to:** stadium@newsystems.ca
- **Subject lines:** Confirmation = "New Stadium: Field Report Submission Received". Team = "New Field Report: {Name}"

## Common Tasks

**Update form copy:** Edit `index.html`, commit, push.

**Update email templates:** Edit `apps-script/Code.gs`, copy contents, paste into Apps Script editor, Deploy > Manage deployments > Edit > New version > Deploy.

**Rotate CSRF token:** Change `FORM_TOKEN` in `Code.gs` and `_token` value in `form.js` data object. Redeploy both.

**Check submissions:** Open the Google Sheet directly, or check stadium@newsystems.ca inbox.

## Do NOT Modify

- The `setupSheet()` function column order without updating `appendRow` to match
- The `Content-Type: text/plain` header in the fetch call (prevents CORS preflight)
- Email format from plain text to HTML without keeping all user-controlled fields wrapped in `escapeHtml()` / `escapeHtmlMultiline()`

## Session Context

### 2026-05-05
Forked from `new-casting-call`. Replaced Step 2 with 7 Field Report questions (question, methods, links, format, learnings, outcomes, other). Added `.form-intro` style and preface paragraphs on both Step 1 and Step 2 explaining what a Field Report is. Adopted stadium-brief email convention (TEAM_EMAIL=stadium@newsystems.ca, multi-line confirmation body, "New Field Report: {Name}" subject). CSRF token `ns-fieldreports-2026`, ID prefix `FR-`, source `fieldreports.newsystems.ca`.

### Outstanding
- Apps Script not yet deployed, so `APPS_SCRIPT_URL` in `form.js` is empty
- Google Sheet not yet created
- Netlify site not yet created
- DNS CNAME `fieldreports.newsystems.ca` not yet set
- GitHub repo not yet created
- See `DEPLOY.md` for step-by-step instructions
