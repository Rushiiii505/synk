<div align="center">

```
  ███████╗██╗   ██╗███╗   ██╗██╗  ██╗
  ██╔════╝╚██╗ ██╔╝████╗  ██║██║ ██╔╝
  ███████╗ ╚████╔╝ ██╔██╗ ██║█████╔╝ 
  ╚════██║  ╚██╔╝  ██║╚██╗██║██╔═██╗ 
  ███████║   ██║   ██║ ╚████║██║  ██╗
  ╚══════╝   ╚═╝   ╚═╝  ╚═══╝╚═╝  ╚═╝
```

<img src="src/app/icon.svg" alt="synk Logo" width="80" height="80" />

# **synk**
### **Next-Gen Collaborative Sprints, Team Notepad & Treasury Operations**

[![Next.js 16](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS 4](https://img.shields.io/badge/Tailwind_4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth_%26_DB-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![React Bits](https://img.shields.io/badge/React_Bits-PixelSwap_%26_ScrollReveal-84CC16?style=for-the-badge)](https://reactbits.dev/)
[![Currency](https://img.shields.io/badge/Treasury-INR_(₹)-F59E0B?style=for-the-badge)](https://github.com/Rushiiii505/synk)

<p align="center">
  <strong>synk</strong> is a high-velocity, single-page operations hub designed for startup collectives, creator studios, and agile product teams. It synchronizes sprint Kanban cards, multi-color sticky notes, and real-time treasury cashflows in Indian Rupees (₹) into one unified command center.
</p>

---

</div>

## ✨ Core Pillars & Features

### 📋 1. Collaborative Agile Sprint Board (Trello-Style)
- **Drag-and-Drop Kanban Columns**: Ideas & Backlog, To Do, In Progress, Review, and Done.
- **Budget-Tagged Cards in ₹**: Assign financial budgets directly to tasks for sprint cost-tracking.
- **Subtasks & Image Attachments**: Checklists, cover image uploads, priority tags, and color label bars.
- **Mobile Touch-Swipe**: Native snap-scrolling on iOS and Android phones.

### 📝 2. Team Sticky Notepad & Live Scratchpad
- **Color-Coded Sticky Notes**: Mint, Yellow, Lavender, Sky Blue, and Peach memos for design ideas and meeting minutes.
- **Pinning & Diagrams**: Pin critical memos to the top and attach image diagrams.
- **Real-Time Synchronized Scratchpad**: Shared Markdown scratchpad with 1-click clipboard copying.

### 💳 3. Treasury Cashflow Hub (Money IN vs Money OUT in ₹)
- **Real Inflow & Outflow Tracking**: Log client retainers, investor funding (+ IN) and software subscriptions, contractor payouts (- OUT).
- **Invoice & Receipt Preview**: Attach and inspect payment receipts directly in the ledger.
- **Multi-Member Cost Splitting**: Calculate and track expense splits among collaborators with live settlement tracking.
- **Dynamic Spending vs Cap Chart**: Interactive SVG dual-bar graph comparing monthly outflow against target treasury caps.

### ⚡ 4. React Bits Interactive Component Integrations
- **`<PixelSwap />` Treasury Engine**: Interactive pixel pop animation toggling between the live Lime Treasury Reserve Balance and real-time operational velocity metrics.
- **`<ScrollReveal />` Manifesto Deck**: GSAP-powered word-by-word blur and rotation scrub for team mission statements.

### 👤 5. Executive Gradient Monogram Avatar System
- Deterministic, high-contrast 2-letter uppercase monogram badges with live presence status indicators (online, focusing, meeting, away, offline).

### 🔐 6. Supabase Authentication & Multi-Project Memory
- Clean light theme authentication (Sign Up / Sign In).
- Auto-generates shareable Unique Project IDs (e.g. `SYNK-8421`).
- Remembers past created and joined workspaces per user account with 1-click workspace switching.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) + Custom Glassmorphism Tokens |
| **Animations** | [GSAP](https://greensock.com/gsap/), [React Bits](https://reactbits.dev/), Canvas Confetti |
| **Backend & Auth** | [Supabase](https://supabase.com/) |
| **Icons** | [Lucide React](https://lucide.dev/) |

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/Rushiiii505/synk.git
cd synk
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) (or `http://localhost:3001`) in your browser.

### 5. Build for Production
```bash
npm run build
npm run start
```

---

## 📱 Mobile Responsiveness

synk is engineered mobile-first with:
- `touch-pan-x snap-x snap-mandatory` horizontal kanban swiping.
- Compact operations header with quick action triggers.
- Responsive table containers and bottom-sheet modals.

---

## 📄 License

This project is licensed under the MIT License.

<div align="center">
  <sub>Built with ⚡ by <a href="https://github.com/Rushiiii505">Rushiiii505</a></sub>
</div>
