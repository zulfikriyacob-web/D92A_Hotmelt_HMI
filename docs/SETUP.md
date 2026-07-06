# Setup Guide

Step-by-step deployment from zero to live app. Ambil masa ~10 minit.

---

## Part 1 — Google Sheet + Backend

### 1.1 Create the sheet
1. Buka browser → taip `sheets.new` → tekan Enter
2. Nama sheet: **"D92A Hotmelt Usage"**
3. **Biarkan `Sheet1` kosong** — script akan auto-create tab `LOG` bila entry pertama masuk

### 1.2 Open Apps Script editor
1. Menu **Extensions** → **Apps Script**
2. New tab akan buka — inilah IDE untuk backend

### 1.3 Paste the code
1. Padam semua kod default dalam `Code.gs` (yang ada `function myFunction()`)
2. Buka **[apps-script/Code.gs](../apps-script/Code.gs)** dari repo
3. Copy semua → paste dalam Apps Script editor
4. Tekan **Save** icon 💾 (atau `Ctrl+S`) — bagi nama project mana-mana

### 1.4 Deploy as Web App
1. Butang **Deploy** (kanan atas) → **New deployment**
2. Klik ⚙ (gear icon) → pilih **Web app**
3. Setup:
   - **Description**: `D92A Hotmelt v1`
   - **Execute as**: `Me (your@email.com)`
   - **Who has access**: `Anyone` ⚠️ **PENTING** — app kat GitHub Pages takde login
4. **Deploy** → akan prompt authorize
5. Pilih Google account → **Allow** (kalau ada warning "unverified app", klik **Advanced** → **Go to project (unsafe)** — safe sebab script Zul sendiri)
6. **Copy the Web app URL** — mesti habis dengan **`/exec`** (bukan `/dev`)

**Save this URL** — kita akan guna dalam step berikutnya:
```
https://script.google.com/macros/s/AKfy.../exec
```

### 1.5 Test the backend
Paste URL tu dalam tab browser baru dan tekan Enter. Patut nampak:
```json
{"ok":true,"app":"D92A Hotmelt API","time":"..."}
```
Kalau nampak — backend live! 🎉

---

## Part 2 — Frontend Setup

### 2.1 Wire up API URL
1. Buka **[index.html](../index.html)** dalam text editor
2. Cari baris ni (dalam `<script>` block):
   ```js
   const API_URL = '';
   ```
3. Paste URL yang di-copy tadi:
   ```js
   const API_URL = 'https://script.google.com/macros/s/AKfy.../exec';
   ```
4. Save

### 2.2 Test locally (optional)
- Double-click `index.html` → buka dalam browser
- Kat pojok atas kanan, `MODE` pill patut tunjuk **LIVE** (bukan DEMO)
- Cuba SAVE satu entry → buka Google Sheet → sheet `LOG` patut auto-appear dengan 1 row

---

## Part 3 — Deploy to GitHub Pages

### 3.1 Create repository
1. GitHub → **New repository**
2. Nama: `d92a-hotmelt` (atau apa-apa Zul suka)
3. **Public** ⚠️ (Pages free tak boleh untuk private)
4. **Create**

### 3.2 Upload files
Ada 2 cara — pilih yang senang:

**A) Via GitHub web (mobile-friendly):**
1. Kat repo baru tu → **uploading an existing file**
2. Drag `index.html` je (root level)
3. Commit changes

**B) Via git CLI:**
```bash
git clone https://github.com/<username>/d92a-hotmelt.git
cd d92a-hotmelt
cp /path/to/index.html .
git add . && git commit -m "Initial upload" && git push
```

### 3.3 Enable Pages
1. Repo **Settings** (top nav)
2. Sidebar → **Pages** (bawah "Code and automation")
3. Under **Source** → **Deploy from a branch**
4. **Branch** → `main` → folder `/ (root)` → **Save**
5. Tunggu ~1 minit → refresh page
6. URL live akan muncul kat atas:
   ```
   https://<username>.github.io/d92a-hotmelt/
   ```

### 3.4 Verify
- Buka URL kat phone
- Status bar: `● SYSTEM · MODE: LIVE`
- SAVE satu entry → check Google Sheet dapat row baru

---

## Part 4 — Making Changes Later

### 4.1 Update the frontend (index.html)
- Edit fail kat GitHub (pencil icon) → **Commit changes**
- GitHub Pages auto-redeploy dalam ~1 minit

### 4.2 Update the backend (Code.gs)
⚠️ **Ini gotcha yang selalu terlepas:**

Apps Script guna **versioned deployments**. Save je tak cukup — kena create new version.

1. Edit `Code.gs` dalam Apps Script editor → **Save**
2. **Deploy** button → **Manage deployments**
3. Pilih deployment yang existing → klik **pencil icon** (Edit)
4. **Version** dropdown → **New version**
5. **Deploy**

URL `/exec` kekal sama, tapi sekarang jalan kod baru.

### 4.3 Add operators
1. Edit `index.html`:
   ```html
   <select id="operator">
     <option>AHMAD</option>
     <option>YOUR_NEW_NAME</option>  <!-- add here -->
   </select>
   ```
2. Ulang untuk `select id="editOp"` (Edit modal)

### 4.4 Change weights
Edit **BOTH** files (kena sama supaya total konsisten):

**index.html:**
```js
const WEIGHTS = { plan:48, b:300, c:200, d:200, e:60, f:58, g:200 };
```

**Code.gs:**
```js
const WEIGHTS = { plan:48, b:300, c:200, d:200, e:60, f:58, g:200 };
```

Jangan lupa Deploy → New version untuk Code.gs.

---

## Common Gotchas

| Symptom | Cause | Fix |
|---|---|---|
| `404` di root URL | File nama bukan `index.html` | Rename ke `index.html` |
| Status bar tunjuk `DEMO` walaupun URL dah set | Cache | Hard refresh (`Ctrl+Shift+R`) |
| `Network error` bila SAVE | URL guna `/dev` not `/exec` | Copy URL yang betul dari Manage deployments |
| Data tak masuk sheet | Web app access set to "Only me" | Redeploy dengan **Anyone** |
| Kod baru tak apply | Deployment guna old version | **Manage deployments → Edit → New version** |
| CORS error dalam console | Header `Content-Type` ditambah manually | Jangan set — biarkan default |
| Butang Pages grey (tak boleh klik) | Repo private | Tukar ke Public (Settings → General) |

---

## QR Code for Line Deployment

Bila site dah live, generate QR code untuk operator scan:

1. Buka site URL kat browser
2. Salin URL
3. Pergi `qr-code-generator.com` atau apa-apa QR service → paste URL
4. Download PNG → print A4 → laminate → tampal kat line D92A

Operator scan → buka app kat phone dorang → terus boleh input. Tak payah install apa-apa.
