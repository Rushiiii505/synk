<div align="center">

<img src="public/synk-banner-dark.svg" alt="synk Platform Banner" width="100%" />

<br />

# **synk**
### *The Next-Gen Unified Operations Platform for Agile Teams & Creator Collectives*

<p align="center">
  <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js" alt="Next.js 16" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript 5" /></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS 4" /></a>
  <a href="https://supabase.com/"><img src="https://img.shields.io/badge/Supabase-Auth_%26_DB-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" /></a>
  <a href="https://reactbits.dev/"><img src="https://img.shields.io/badge/React_Bits-PixelSwap_%26_ScrollReveal-84CC16?style=for-the-badge" alt="React Bits" /></a>
  <a href="https://github.com/Rushiiii505/synk"><img src="https://img.shields.io/badge/Treasury-INR_(₹)-F59E0B?style=for-the-badge" alt="INR Currency" /></a>
</p>

<p align="center">
  <a href="#-core-pillars">Features</a> •
  <a href="#-architecture--workflow">Architecture</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-mobile-experience">Mobile</a> •
  <a href="#-license">License</a>
</p>

<br />

<img src="public/synk-logo-full.svg" alt="synk Full Logo" width="220" />

<p align="center">
  <strong>synk</strong> is a high-velocity, single-page operations hub designed for startup collectives, creator studios, and agile product teams. It synchronizes sprint Kanban cards, multi-color sticky notes, and real-time treasury cashflows in Indian Rupees (₹) into one unified command center.
</p>

---

</div>

## 🌟 Core Pillars

```
 ┌────────────────────────────────────────────────────────────────────────┐
 │                              synk HUB                                  │
 ├───────────────────┬────────────────────┬───────────────────────────────┤
 │  📋 Agile Trello  │  📝 Sticky Notes   │  💳 Treasury Cashflow (₹)     │
 │  • Sprint columns │  • Color memos     │  • Money IN vs Money OUT      │
 │  • ₹ Budget tags  │  • Image diagrams  │  • Invoice receipt preview    │
 │  • Subtasks       │  • Live scratchpad │  • Team cost-split calculator │
 └───────────────────┴────────────────────┴───────────────────────────────┘
```

### 📋 1. Collaborative Agile Sprint Board (Trello-Style)
- **Fluid Drag-and-Drop Columns**: *Ideas & Backlog*, *To Do*, *In Progress*, *Review*, and *Done*.
- **Budget-Tagged Sprint Cards in ₹**: Assign financial budgets directly to tasks for sprint cost tracking.
- **Subtasks & Image Attachments**: Checklists, cover image uploads, priority tags, and color label bars.
- **Mobile Touch Snap-Swipe**: Native `touch-pan-x snap-x` scrolling on iOS and Android phones.

### 📝 2. Team Sticky Notepad & Live Shared Scratchpad
- **Color-Coded Sticky Memos**: Mint, Yellow, Lavender, Sky Blue, and Peach notes with 1-click posting.
- **Pinning & Diagrams**: Pin critical memos to the top and attach image diagrams.
- **Live Synchronized Scratchpad**: Shared Markdown scratchpad with 1-click clipboard copying.

### 💳 3. Treasury Cashflow Hub (Money IN vs Money OUT in ₹)
- **Real-Time Cashflow Ledger**: Log client retainers and funding (+ IN) and software subscriptions and contractor payouts (- OUT).
- **Invoice & Receipt Viewer**: Attach and inspect payment receipts directly in the ledger.
- **Team Cost-Splitting Calculator**: Calculate and track expense splits among collaborators with live settlement tracking.
- **Dynamic Spending vs Cap Chart**: Interactive SVG dual-bar graph comparing monthly outflow against target treasury caps.

### ⚡ 4. React Bits Interactive Component Integrations
- **`<PixelSwap />` Treasury Engine**: Interactive pixel pop animation toggling between the live Lime Treasury Reserve Balance and real-time operational velocity metrics.
- **`<ScrollReveal />` Manifesto Deck**: GSAP-powered word-by-word blur and rotation scrub for team mission statements.

### 👤 5. Executive Gradient Monogram Avatar System
- Deterministic, high-contrast 2-letter uppercase monogram badges with live presence status indicators (*online*, *focusing*, *meeting*, *away*, *offline*).

### 🔐 6. Supabase Authentication & Multi-Project Memory
- Clean light theme authentication (Sign Up / Sign In).
- Auto-generates shareable Unique Project IDs (e.g. `SYNK-8421`).
- Remembers past created and joined workspaces per user account with 1-click workspace switching.

---

## 🏗️ Architecture & Workflow

```mermaid
graph TD
    A[User Auth / Sign In] -->|Supabase Auth| B(Project Selection Hub)
    B -->|Create Workspace| C[Generate SYNK-XXXX ID & ₹ Reserve]
    B -->|Join Workspace| D[Enter Unique ID & Connect]
    B -->|Select Past Project| E[Open Saved Workspace]
    
    C --> F[Unified Operations Hub]
    D --> F
    E --> F
    
    subgraph "Single-Page Command Center"
        F --> G[Interactive PixelSwap Treasury Card]
        F --> H[Collaborative Trello Sprint Board]
        F --> I[Team Sticky Notepad & Scratchpad]
        F --> J[Cashflow IN & OUT Ledger]
        F --> K[Team & Collaborator Settings]
    end
```

---

## 🛠️ Tech Stack

| Layer | Technology | Description |
|---|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) | App Router, Server Components & Turbopack |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) | End-to-end type safety |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) | Custom design tokens & modern micro-interactions |
| **Animations** | [GSAP](https://greensock.com/gsap/) + [React Bits](https://reactbits.dev/) | PixelSwap & ScrollReveal animation components |
| **Backend & Auth** | [Supabase](https://supabase.com/) | Email & Password Auth, PostgreSQL database sync |
| **Icons** | [Lucide React](https://lucide.dev/) | Clean, scalable vector iconography |

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

## 📱 Mobile Experience

`synk` is built mobile-first with:
- `touch-pan-x snap-x snap-mandatory` horizontal kanban swipe.
- Responsive top operations header with quick action triggers.
- Mobile-friendly cashflow tables and bottom-sheet dialogs.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

<div align="center">
  <br />
  <img src="src/app/icon.svg" alt="synk Icon" width="36" height="36" />
  <br />
  <sub>Designed & Developed with ⚡ for high-velocity teams.</sub>
</div>
