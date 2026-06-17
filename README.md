# 💖 Match a Date — Interactive Dating Invitation

A 7-scene interactive web app where your date picks the day, food, movie, and after-dinner activity.

---

## 📁 Required Folder Structure

Make sure these image folders exist before going live:

```
Dating Project/
├── index.html
├── css/main.css
├── js/
│   ├── app.js
│   ├── utils/swipe.js
│   ├── utils/confetti.js
│   └── scenes/scene1.js … scene7.js
├── assets/bg-pattern.svg
└── Image Asset/
    ├── Foods/
    │   ├── Fried Chicken.png
    │   ├── Hotpot.png
    │   ├── Korean BBQ.png
    │   ├── Japanese BBQ.png
    │   ├── Noodles.png
    │   ├── Pizza.png
    │   ├── Vegan Food.png
    │   ├── Chicken Feet.png
    │   └── Ehehe.png
    └── Dessert/
        ├── Coffee.png
        ├── Drinks.png
        ├── Boardgame.png
        ├── Karaoke.png
        └── Tarot.png
```

---

## PART 1 — Push to GitHub & Get a Live URL

### Step 1 — Create a GitHub repository

1. Go to [github.com](https://github.com) and sign in
2. Click the **+** icon (top right) → **New repository**
3. Name it: `match-a-date`
4. Set visibility to **Public**
5. Do **NOT** tick "Add README" or any other checkbox
6. Click **Create repository**
7. Copy the URL shown — it looks like:
   ```
   https://github.com/YOUR_USERNAME/match-a-date.git
   ```

### Step 2 — Push your project from your computer

Open **Git Bash** inside the project folder `E:\Claude Project\Dating Project`, then run these commands **one by one**:

```bash
git init
git add .
git commit -m "feat: Match a Date - 7-scene interactive invitation"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/match-a-date.git
git push -u origin main
```

> **If Git asks for a password** — use a Personal Access Token:
> GitHub → Settings → Developer settings → Personal access tokens → **Generate new token (classic)**
> Tick the `repo` scope → Generate → copy and paste it as the password.

### Step 3 — Enable GitHub Pages (free hosting)

1. On your GitHub repo page, click the **Settings** tab
2. In the left sidebar, click **Pages**
3. Under **Source**, set:
   - Branch: **main**
   - Folder: **/ (root)**
4. Click **Save**
5. Wait 1–2 minutes. Your live URL will appear at the top:
   ```
   https://YOUR_USERNAME.github.io/match-a-date/
   ```

**Send this URL to your date. That's it for hosting!** 🎉

---

## PART 2 — Receive Selections in Google Sheets

Every time your date completes all 7 scenes, their choices are saved to a Google Sheet automatically.

### Step 1 — Create a Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com) → create a new blank spreadsheet
2. Name it: **Match a Date — Responses**
3. In **Row 1**, add these column headers:

   | A | B | C | D | E | F |
   |---|---|---|---|---|---|
   | Timestamp | Date | Starter 1 | Starter 2 | Movie | Activity |

### Step 2 — Create the Apps Script receiver

1. In your Sheet: menu **Extensions → Apps Script**
2. Delete all the default code in the editor
3. Paste in exactly this:

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data  = JSON.parse(e.postData.contents);
  sheet.appendRow([
    data.timestamp,
    data.date,
    data.appetizer1,
    data.appetizer2,
    data.movie,
    data.activity
  ]);
  return ContentService
    .createTextOutput('OK')
    .setMimeType(ContentService.MimeType.TEXT);
}
```

4. Click the **Save** icon (Ctrl+S). Name the project anything you like.

### Step 3 — Deploy as a Web App

1. Click **Deploy** (top right button) → **New deployment**
2. Click the ⚙ gear icon next to "Select type" → choose **Web app**
3. Set:
   - **Execute as**: `Me`
   - **Who has access**: `Anyone`
4. Click **Deploy**
5. Click **Authorize access** → choose your Google account → **Allow**
6. Copy the **Web app URL** — it looks like:
   ```
   https://script.google.com/macros/s/AKfycbXXXXXXXXX/exec
   ```

### Step 4 — Paste the URL into the app

Open [`js/scenes/scene7.js`](js/scenes/scene7.js) and find **line 9**:

```javascript
var SHEETS_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL';
```

Replace it with your URL:

```javascript
var SHEETS_URL = 'https://script.google.com/macros/s/AKfycbXXXXXXXXX/exec';
```

Save the file.

### Step 5 — Push the update to GitHub

```bash
git add js/scenes/scene7.js
git commit -m "feat: connect Google Sheets to receive selections"
git push
```

GitHub Pages updates automatically in ~1 minute.

### Step 6 — Test it end-to-end

1. Open your live GitHub Pages URL
2. Go through all 7 scenes and complete all selections
3. Check your Google Sheet — a new row should appear with all the answers ✅

---

## 🔄 Updating the app later

After any code change:

```bash
git add .
git commit -m "update: describe your change here"
git push
```

GitHub Pages redeploys automatically.

---

## 🎮 The 7 Scenes

| Scene | Name | What happens |
|-------|------|--------------|
| 1 | Match a Date | Tap the heart to begin |
| 2 | The Invitation | Open the envelope, try to click "No thanks" |
| 3 | Pick a Date | Calendar with 3D flip and ink circle animation |
| 4 | Entrée | Swipe food cards — pick 2 starters |
| 5 | Main Course | Swipe movie posters — pick 1 film at CGV |
| 6 | Dessert | Swipe after-dinner activities — pick 1 |
| 7 | Set Menu | Luxury summary + auto-saves to Google Sheets |

---

*Made with 💖 — Can't wait to see you!*
