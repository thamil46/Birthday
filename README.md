# 🎀 Birthday Surprise App for Sneka

A beautiful, fully responsive birthday surprise web app built with **pure HTML, CSS & JavaScript** — no frameworks, no backend.

## ✨ Features
- 🎁 Animated intro page with floating emojis
- 🔐 Identity verification (name + date of birth)
- 🎂 Interactive animated birthday cake (click to blow candles!)
- 🎉 Canvas confetti explosion
- 🎵 Birthday music via Web Audio API
- ⏳ Live countdown to next birthday
- 💝 Personalized "Things She Loves" cards (chocolate, teddy, flowers, bangles, earrings)
- 🎁 4 clickable animated gift boxes
- 💌 Heartfelt personal message
- 📸 Photo gallery (add your own photos!)
- 🌟 Scrolling birthday wishes ticker
- 📱 Fully responsive — works on all phones, tablets & laptops

## 🚀 How to Host on GitHub Pages

1. Create a new **public** GitHub repository (e.g. `sneka-birthday`)
2. Upload all 3 files: `index.html`, `style.css`, `app.js`
3. Go to **Settings → Pages**
4. Under **Source**, select `main` branch → `/ (root)`
5. Click **Save** — your site will be live at:
   `https://YOUR-USERNAME.github.io/sneka-birthday/`

## 📸 Adding Photos

In `index.html`, find the section:
```html
<div class="gallery-grid" id="gallery-grid">
  <div class="gallery-placeholder">🌸<br/><small>Memory 1</small></div>
  ...
</div>
```

Replace each `gallery-placeholder` div with:
```html
<div class="gallery-placeholder">
  <img src="photo1.jpg" alt="Memory 1" />
</div>
```

Then upload your photo files alongside index.html on GitHub.

## 🔐 Identity Verification
- **Name:** Sneka (case-insensitive)
- **Birthday:** June 17, 2002 (pre-filled; editable as DD/MM/YYYY or YYYY-MM-DD)

## 📁 Files
- `index.html` — All pages and structure
- `style.css` — All animations and styles
- `app.js` — All interactivity and logic
