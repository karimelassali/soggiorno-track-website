# Soggiorno Track

The premium independent companion app for the Permesso di Soggiorno journey in Italy. Track status, prepare documents, access Italian immigration guides, and get expert help from Sofia AI.

## Features

- **Track Status**: Monitor your Permesso di Soggiorno application status
- **Document Preparation**: Get guidance on required documents for your immigration process
- **Italian Immigration Guides**: Access comprehensive guides about living in Italy
- **Sofia AI**: Get expert AI-powered assistance for your immigration questions

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **AI**: Google Gemini API (@google/genai)
- **UI Components**: 
  - Lucide React (icons)
  - Motion (animations)
  - Custom components (Aceternity, Reactbits)
- **Form Handling**: React Hook Form
- **Utilities**: clsx, class-variance-authority, tailwind-merge

## Getting Started

### Prerequisites

- Node.js 20+
- Bun or npm package manager
- Google Gemini API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd soggiorno-track
```

2. Install dependencies:
```bash
bun install
# or
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Gemini API key:
```
GEMINI_API_KEY=your_gemini_api_key_here
APP_URL=http://localhost:3000
```

### Development

Run the development server:
```bash
bun dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `bun dev` / `npm run dev` - Start development server
- `bun build` / `npm run build` - Build for production
- `bun start` / `npm run start` - Start production server
- `bun lint` / `npm run lint` - Run ESLint
- `bun clean` / `npm run clean` - Clean Next.js cache

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page component
├── assets/                # Static assets
├── components/            # Reusable components
│   ├── aceternity/        # Aceternity UI components
│   └── reactbits/         # Reactbits components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions and translations
│   ├── translations.ts    # i18n translations
│   └── utils.ts           # Helper utilities
├── .env.example           # Environment variables template
└── package.json           # Dependencies and scripts
```

## Configuration

### Google Gemini API

This application uses Google's Gemini AI for the Sofia AI assistant feature. To use it:

1. Get an API key from [Google AI Studio](https://aistudio.google.com/)
2. Add it to your `.env.local` file as `GEMINI_API_KEY`

### Tailwind CSS

The project uses Tailwind CSS v4 with the following plugins:
- `@tailwindcss/postcss`
- `@tailwindcss/typography`

## License

Private - All rights reserved

## Support

For questions about the Permesso di Soggiorno process, use the Sofia AI assistant within the app.
