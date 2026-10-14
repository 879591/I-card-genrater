# 5tar Employee Card Maker — Website + Installable PWA

> **Create Professional Employee ID Cards in Minutes**
> **मिनटों में बनाएँ प्रोफेशनल Employee ID Card**

---

## 🌟 Project Overview

**5tar Employee Card Maker** is a production-ready, mobile-first Employee ID Card Generator built as an installable Progressive Web App (PWA). It empowers schools, colleges, IT corporations, offices, hospitals, factories, security agencies, and startups to design, customize, preview, and download international ISO standard CR80 ID badges in high-resolution PNG, JPG, and print-ready PDF formats.

- **Developer:** Suraj Maurya
- **Creator Brand:** 5tar Suraj
- **Digital Brand:** Supriya Digital Research (SDR)
- **Location:** Rudhauli, Basti, Uttar Pradesh, India
- **Pricing:** 100% Free Forever for everyone (No watermark, no forced login, no subscription paywalls).

---

## 🚀 Key Features

1. **8+ Production-Grade Card Templates:**
   - 🏢 Corporate Employee ID (Royal Navy & Blue)
   - 💼 Office Staff ID (Minimalist Teal & Slate)
   - 🏫 School Staff ID (Academic Crimson & Gold)
   - 🎓 College Employee ID (Scholarly Emerald & Seal)
   - 🏥 Hospital Staff ID (Medical Cyan & Rose with Blood Group)
   - 🛡️ Security Staff ID (Tactical Obsidian & Hazard Yellow)
   - 🏭 Factory Worker ID (Industrial Orange & High-Contrast Safety)
   - 👔 Business Professional ID (Luxury Violet & Executive Motif)

2. **Both Orientations Supported:**
   - **Portrait (Vertical):** 54mm × 85.6mm (CR80 standard)
   - **Landscape (Horizontal):** 85.6mm × 54mm (CR80 standard)

3. **Front and Back Interactive Design:**
   - Real-time live card preview updates as you type.
   - 3D Flip Card animation for inspecting both front and back.
   - Side-by-side comparison mode.
   - Lanyard clip slot, barcode, and authorized signature support.

4. **22-Field Comprehensive Details Form:**
   - Full Name, Employee ID, Designation, Organization Name, Department.
   - Passport photo upload & replacement preview.
   - Organization logo upload.
   - Date of Joining, DOB, Issue Date, Expiry Date.
   - Blood Group, Phone, Email, Office Address, Emergency ICE contact.
   - Authorized Signatory name and digital signature image.
   - Individual field visibility toggles (hide/show any element).

5. **Dual QR Code Architecture:**
   - **Mode A (Information QR):** Selectively encodes employee contact details into a vCard/text payload.
   - **Mode B (Verification QR):** Emits a cryptographic, non-guessable verification record ID (`5TAR-XXXX-XXXX`) with status indicator (Active, Expired, Revoked) for enterprise verification.

6. **Client-Side Export & Printing:**
   - High-resolution 300 DPI PNG download.
   - High-resolution JPG download.
   - Standard ISO CR80 print-ready PDF download (both Front and Back sides).
   - Direct-to-printer dialog with card layout rules.
   - Custom filenames: `Employee-ID-Rahul-Sharma.png`, `Employee-ID-Rahul-Sharma.pdf`.

7. **Local "My Cards" Storage:**
   - Save cards locally using browser **IndexedDB**.
   - Open, edit, duplicate, and delete saved cards anytime.
   - Zero remote server uploads — completely private.

8. **Installable PWA & Offline Support:**
   - Web App Manifest compliant with Chromium, Android, and iOS Safari.
   - Service Worker precaching with `vite-plugin-pwa`.
   - In-app Install Prompt button.
   - Works seamlessly when offline.

9. **Bilingual User Interface:**
   - Full English and Hindi (हिंदी) translations.

---

## 🛠️ Technology Stack

- **Framework:** React 19 + TypeScript
- **Bundler:** Vite 8
- **PWA Tooling:** `vite-plugin-pwa` + Workbox
- **Styling:** Tailwind CSS v4
- **Icons:** `lucide-react`
- **QR Generation:** `qrcode`
- **PDF Generation:** `jspdf`
- **Image Rendering:** `html2canvas`
- **Celebration Effects:** `canvas-confetti`

---

## 📦 Local Installation & Development

```bash
# 1. Clone the repository
git clone https://github.com/your-username/5tar-Employee-Card-Maker.git
cd 5tar-Employee-Card-Maker

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

The application will be accessible at `http://localhost:3000`.

---

## 🏗️ Production Build

```bash
# Build production bundle with PWA service worker
npm run build

# Preview production build locally
npm run preview
```

---

## 🚢 Deployment Guide (GitHub & Vercel)

### Step 1: Push to GitHub (सरल हिंदी निर्देश)

1. [GitHub.com](https://github.com/) पर जाएँ और नया रिपॉजिटरी बनाएँ, नाम रखें: `5tar-Employee-Card-Maker`
2. अपने टर्मिनल में ये कमांड्स चलाएँ:

```bash
git init
git add .
git commit -m "Initial release of 5tar Employee Card Maker PWA"
git branch -M main
git remote add origin https://github.com/<YOUR-USERNAME>/5tar-Employee-Card-Maker.git
git push -u origin main
```

### Step 2: Deploy to Vercel (एक क्लिक में डिप्लॉय)

1. [Vercel.com](https://vercel.com/) पर अपने GitHub अकाउंट से लॉगिन करें।
2. **Add New...** → **Project** पर क्लिक करें।
3. अपनी `5tar-Employee-Card-Maker` रिपॉजिटरी चुनें और **Import** पर क्लिक करें।
4. Project Settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. **Deploy** बटन पर क्लिक करें। 1 मिनट में आपकी वेबसाइट और PWA लाइव हो जाएगी!

---

## 🔒 Privacy & Security Architecture

- **No Remote Telemetry:** The app doesn't collect or transmit photos or employee records.
- **Client-Side Generation:** Canvas rendering and PDF compilation occur strictly on the user's device.
- **Offline Reliability:** Service worker caches static assets so users can generate and download cards without an active internet connection.

---

## 👨‍💻 About Developer

- **Full Name:** Suraj Maurya
- **Creator Name:** 5tar Suraj
- **Digital Brand:** Supriya Digital Research (SDR)
- **Location:** Rudhauli, Basti, Uttar Pradesh, India
- **Education:**
  - High School (Class 10, 2024): Dileshwari Inter College, Rudhauli, Basti, UP Board
  - Intermediate (Class 12, 2026): Dileshwari Inter College, Rudhauli, Basti, UP Board
  - Current: Bachelor of Arts (B.A.), First Year | Siddharth University (Geography, Economics, Minor Sanskrit)
- **Contact:** +91 97920 06815
- **Instagram:** [@5tar.suraj](https://www.instagram.com/5tar.suraj?stkn=OWZjNXhyb2toanZk)
- **Facebook:** [Suraj Maurya](https://www.facebook.com/share/1FDbbX2rcH/)
- **YouTube:** 5tar Suraj

---

## 📄 License

MIT License. Free for personal, organizational, and educational use.
Developed with pride by **5tar Suraj** (Supriya Digital Research).
