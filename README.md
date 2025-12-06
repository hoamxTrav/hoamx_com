# 🏡 HOAMX Website
Modern HOA Management for Minnesota Communities  
Static Website • Firebase Hosting • SEO Optimized

## 🚀 Overview
This repository contains the public-facing website for **HOAMX**, a modern HOA management platform built for Minnesota communities.  
The site is fully static (HTML, CSS, JS) and is deployed through **Firebase Hosting** with:

- 📱 Progressive Web App (PWA) support  
- 🔍 Fully optimized SEO + structured data (JSON-LD)  
- 🖼 OpenGraph + social share images  
- 📈 Google Analytics (GA4) + Google Ads tracking  
- 🧩 Centralized `/icons/` directory for favicons + PWA icons  

The public folder is set to `"."`, meaning **the repository root is the hosting root**.

## 📂 Project Structure
```
/
├── index.html
├── platform.html
├── pricing.html
├── compliance.html
├── roadmap.html
├── blog.html
├── contact.html
│
├── manifest.webmanifest
├── browserconfig.xml
│
├── /assets/
│   ├── site.css
│   └── include.js
│
├── /images/
│   └── og-hoamx-cover.png
│
├── /icons/
│   ├── favicon-16.png
│   ├── favicon-32.png
│   ├── favicon-48.png
│   ├── icon-72.png
│   ├── icon-96.png
│   ├── icon-128.png
│   ├── icon-144.png
│   ├── icon-152.png
│   ├── icon-167.png
│   ├── icon-180.png
│   ├── icon-192.png
│   ├── icon-256.png
│   ├── icon-384.png
│   ├── icon-512.png
│   ├── mstile-70.png
│   ├── mstile-150.png
│   ├── mstile-310.png
│   └── mstile-310x150.png
│
└── firebase.json
```

## 🔧 Firebase Hosting
Deploy the site:
```
firebase deploy --only hosting
```

## 🔍 SEO + Structured Data
Includes canonical URLs, optimized titles/descriptions, OG tags, Twitter cards, Pinterest rich pins, and JSON-LD schemas (`Organization`, `WebPage`, and `ContactPage`).

## 📱 PWA Support
Includes:
- `manifest.webmanifest`
- `browserconfig.xml`
- full icon pack in `/icons/`
- address bar & tile colors
- maskable icons (for Android)

## 🧪 Local Preview
Run a lightweight dev server:
```
npx serve .
```
or:
```
python3 -m http.server 8080
```

## 📈 Analytics
Unified Google tag includes:
- GA4 ID: `G-54NVLM1HSM`
- Google Ads ID: `AW-17770789282`

## 📬 Contact
**Email:** github@hoamx.com  
**Website:** https://hoamx.com
