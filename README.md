# Solstice Period Tracker 🌸

A premium, AI-powered period and cycle tracking application built with React, TypeScript, Tailwind CSS, and Supabase.

## Features

- 🔐 **Secure Authentication** - Email magic link login via Supabase Auth
- 📊 **Real-time Data Sync** - Cloud-based storage with Supabase
- 📅 **Navigable Calendar** - Track your cycle across multiple months
- 📈 **Data Visualization** - Interactive charts showing cycle trends
- 🔒 **Privacy Lock** - PIN protection for sensitive health data
- 📱 **PWA Support** - Install as a native app on any device
- 🌙 **Dark Mode** - Beautiful dark theme optimized for night use
- ✨ **Premium UI** - Glassmorphism, smooth animations, and modern design

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Icons**: Material Symbols
- **Date Utils**: date-fns

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/solstice-tracker.git
cd solstice-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Database Setup

Run the SQL schema in your Supabase SQL Editor (found in `schema.sql`):

```sql
-- Creates profiles and logs tables with RLS policies
-- See schema.sql for full details
```

## Deployment

### Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy!

## License

MIT

<!-- Deployment triggered on Dec 28, 2025 -->

## Author

Built with ❤️ for better health tracking
