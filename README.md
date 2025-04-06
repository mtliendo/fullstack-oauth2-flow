# Project Starter

A modern React application starter template built with Vite, TypeScript, TailwindCSS, and DaisyUI.

Honestly, I just got tired of setting up the same frontend. I usually couple this with an Amplify backend.
In any case, hope this simple repo helps :)

## Features

- ⚡️ **Vite** - Lightning fast build tool
- 🔷 **TypeScript** - Type safety for robust applications
- ⚛️ **React 19** - Latest React version
- 🧩 **React Router 7** - Advanced routing capabilities
- 🎨 **TailwindCSS 4** - Utility-first CSS framework
- 🌼 **DaisyUI** - Component library for TailwindCSS
- 🔍 **ESLint** - Code quality tools

## Project Structure

```
project-starter/
├── src/
│   ├── assets/       # Static assets
│   ├── components/   # Reusable UI components
│   │   ├── Footer.tsx
│   │   ├── Navbar.tsx
│   │   └── ThemeController.tsx
│   ├── pages/        # Application pages
│   │   ├── Home.tsx
│   │   └── Secondary.tsx
│   ├── main.tsx      # App entry point
│   └── index.css     # Global styles
├── public/           # Static files
└── ...configuration files
```

## Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone https://github.com/focusotter/project-starter.git
cd project-starter
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Start the development server

```bash
npm run dev
# or
yarn dev
```

4. Open your browser and visit `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint to check code quality
- `npm run preview` - Preview the production build locally

## License

MIT
