# Deploy Instructions

## 1. Google Sheet + Apps Script

### Create the Sheet
1. Create a new Google Sheet called **"New Stadium: Field Report Submissions"**
2. Go to **Extensions > Apps Script**
3. Delete any existing code in the editor
4. Copy the entire contents of `apps-script/Code.gs` and paste it in
5. Save (Ctrl+S)

### Create the sheet headers
1. In the Apps Script editor, select `setupSheet` from the function dropdown (next to the play button)
2. Click the play button to run it
3. Google will ask for permissions. Click **Review Permissions > Advanced > Go to (project name) > Allow**
4. Go back to your Sheet. You should see a "Submissions" tab with all 21 column headers

### Deploy as Web App

> ⚠️ **Deploy from `email@newsystems.ca`, not `tommy@newsystems.ca`.** `stadium@newsystems.ca` is a forwarding alias whose recipient list includes tommy@. Deploying from tommy@ causes the team notification to loop back to the sender and get filtered out of the inbox by Gmail. The same constraint applies to the sibling `new-stadium-brief` project.

1. Sign in to the Apps Script editor as **email@newsystems.ca** (use a separate browser profile, incognito, or sign out and back in). If the Sheet was created by another account, share it with email@ as Editor first, then open it from email@'s Drive.
2. In Apps Script, click **Deploy > New deployment**
3. Click the gear icon next to "Select type" and choose **Web app**
4. Settings:
   - Description: "Field Reports submission handler"
   - Execute as: **Me** (must be email@newsystems.ca)
   - Who has access: **Anyone**
5. Click **Deploy**, accept any auth prompts (Spreadsheet + Gmail scopes)
6. Copy the Web App URL (it looks like `https://script.google.com/macros/s/XXXX/exec`)

### Wire the URL into the form
1. Open `form.js`
2. Paste the URL on line 1:
   ```js
   const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_ID_HERE/exec';
   ```
3. Save

### Test it
1. Open the form locally (or via the Launch preview), fill it out, submit
2. Check the Google Sheet for a new row
3. Check stadium@newsystems.ca for the team notification email
4. Check the submitter email for the confirmation

## 2. GitHub

1. Create a new repo (e.g. `newsystemss/field-reports`)
2. From the project folder:
   ```
   cd /Users/Tommy/Documents/Dev/field-reports
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin git@github.com:newsystemss/field-reports.git
   git push -u origin main
   ```

## 3. Netlify (fieldreports.newsystems.ca)

### Create a new Netlify site
1. Go to https://app.netlify.com
2. **Add new site > Import an existing project > GitHub**
3. Pick the new repo (`newsystemss/field-reports`)
4. No build command, publish directory = root (`.`)
5. Deploy

### Custom domain
1. Site settings > **Domain management > Add custom domain**
2. Enter `fieldreports.newsystems.ca`
3. If DNS is managed through Netlify, the CNAME is auto-configured. Otherwise add a CNAME at your DNS provider:
   - Name: `fieldreports`
   - Value: `<your-site-name>.netlify.app`
4. Wait for SSL to provision (usually a few minutes)

### Verify
1. Visit https://fieldreports.newsystems.ca
2. The form should load
3. Submit a test entry and verify the full flow (Sheet + emails to stadium@newsystems.ca + confirmation back to submitter)

## 4. Updating later

Frontend: push to `main`, Netlify auto-deploys.
Backend: edit `apps-script/Code.gs`, paste into Apps Script editor, **Deploy > Manage deployments > Edit > New version > Deploy**.
