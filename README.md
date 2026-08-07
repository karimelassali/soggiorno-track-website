# 🇮🇹 Soggiorno Track

> **Your intelligent companion for navigating the Italian Permesso di Soggiorno journey.**  
> Stop guessing. Start tracking. Get approved.

---

## ✨ What is Soggiorno Track?

Navigating the Italian bureaucracy for your **Permesso di Soggiorno** (Residence Permit) can be a nightmare of confusing portals, lost documents, and endless waiting. 

**Soggiorno Track** changes that. It's a modern, AI-powered dashboard designed to:
- 🕵️ **Track** your application status in real-time.
- 📄 **Prepare** your documents with automated checklists.
- 🤖 **Chat** with *Sofia*, our specialized immigration AI assistant.
- 📚 **Learn** from comprehensive, up-to-date guides.

Built for expats, by expats. Built with the latest web technologies for speed and reliability.

---

## 🚀 Features at a Glance

| Feature | Description |
| :--- | :--- |
| **📊 Real-Time Dashboard** | Visualize your application stage with progress bars and status indicators. |
| **🤖 Sofia AI Assistant** | Get instant answers to complex immigration questions powered by Google Gemini. |
| **📑 Document Vault** | Securely organize and validate your required paperwork before submission. |
| **📘 Smart Guides** | Step-by-step tutorials tailored to your specific visa type (Work, Study, Family). |
| **🌐 Multi-Language** | Seamlessly switch between English and Italian interfaces. |

---

## 🛠️ Tech Stack

We use the bleeding edge of modern web development to ensure a fast, secure, and beautiful experience.

### Core Framework
*   **Next.js 15** (App Router) – The React framework for production.
*   **TypeScript** – Strictly typed for robustness and fewer bugs.
*   **Tailwind CSS 4** – Utility-first styling with the new engine for ultimate performance.

### UI & Experience
*   **Shadcn/ui** – Beautifully designed, accessible components.
*   **Framer Motion** – Silky smooth animations and transitions.
*   **Lucide React** – Crisp, consistent iconography.

### Intelligence & Backend
*   **Google Gemini API** – The brain behind "Sofia," our AI immigration expert.
*   **Server Actions** – Secure, direct database mutations without API endpoints.
*   **PostgreSQL** (via Neon/Supabase) – Reliable relational data storage.

---

## 🏁 Getting Started

Ready to take control of your residency journey? Follow these steps to get the project running locally.

### Prerequisites

Ensure you have the following installed:
- **Node.js** 20+ (or **Bun**)
- **Git**

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/soggiorno-track.git
cd soggiorno-track
```

### 2. Install Dependencies

We recommend using **Bun** for speed, but npm works perfectly too.

```bash
# Using Bun
bun install

# Or using npm
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory and add your API keys:

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
# Google Gemini API Key (Get one at https://aistudio.google.com/)
GEMINI_API_KEY=your_gemini_api_key_here

# Database URL (PostgreSQL)
DATABASE_URL="postgresql://user:password@host:5432/dbname"

# Next Auth Secret (Generate with: openssl rand -base64 32)
NEXTAUTH_SECRET="your_secret_key"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Run the Development Server

```bash
# Using Bun
bun dev

# Or using npm
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the magic happen. ✨

---

## 📂 Project Structure

A clean, modular architecture designed for scalability.

```text
soggiorno-track/
├── app/                  # Next.js App Router pages & layouts
│   ├── (dashboard)/      # Protected dashboard routes
│   ├── (marketing)/      # Public landing pages
│   ├── api/              # API endpoints & webhooks
│   └── layout.tsx        # Root layout with providers
├── components/           # Reusable React components
│   ├── ui/               # Base UI components (Buttons, Inputs)
│   ├── dashboard/        # Dashboard-specific widgets
│   └── ai/               # Sofia AI chat interface
├── lib/                  # Utility functions & configurations
│   ├── gemini.ts         # AI logic
│   ├── db.ts             # Database connection
│   └── utils.ts          # Helper functions
├── public/               # Static assets (images, fonts)
└── styles/               # Global styles & Tailwind config
```

---

## ⚡ Available Scripts

| Command | Description |
| :--- | :--- |
| `dev` | Starts the development server with hot reloading. |
| `build` | Creates an optimized production build. |
| `start` | Runs the built application in production mode. |
| `lint` | Checks code quality using ESLint. |
| `type-check` | Validates TypeScript types without emitting files. |

---

## 🎨 Design Philosophy

Our design isn't just about looking good; it's about reducing anxiety.
- **Calm Colors:** Soothing blues and greens to counter bureaucratic stress.
- **Clear Typography:** Readable fonts for dense legal information.
- **Feedback Loops:** Every action has a clear reaction, so you never feel lost.

---

## 🤝 Contributing

We welcome contributions! Whether it's fixing a typo, adding a new guide, or improving the AI prompts, please feel free to open an issue or submit a PR.

1. Fork the repo.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Made with ❤️ for the Expat Community in Italy**

[Report Bug](https://github.com/yourusername/soggiorno-track/issues) · [Request Feature](https://github.com/yourusername/soggiorno-track/issues)

</div>
