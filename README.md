<div align="center">

# Cyclops

### Smart career intelligence for students, institutions, and industry

![Cyclops](https://readme-typing-svg.demolab.com?font=Inter&weight=700&size=28&pause=900&color=2563EB&center=true&vCenter=true&width=760&lines=Discover+skills.+Build+careers.;Practice+with+AI.+Interview+with+confidence.;Connect+campus+talent+with+industry.)

**Ramaiah University of Applied Sciences · SIH Internal Hackathon 2026**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Framer Motion](https://img.shields.io/badge/Framer%20Motion-Animations-EF008F?logo=framer&logoColor=white)](https://www.framer.com/motion/)

</div>

## About

Cyclops is a career and placement intelligence platform built for the **Ramaiah University of Applied Sciences SIH Internal Hackathon 2026**. It helps students understand their strengths, practise interviews, and present verified portfolios while giving institutions and industry teams a shared view of talent, opportunities, and placement progress.

## Features

- **Student career command center** — Track skills, opportunities, notifications, and career progress in one place.
- **AI mock interviews** — Practise role-specific interviews, receive structured feedback, and review interview history.
- **Resume Studio** — Create a polished resume and get AI-assisted improvement suggestions.
- **Digital portfolio and passport** — Present projects, skills, certifications, and a shareable profile.
- **Industry recruitment workspace** — Discover candidates, create opportunities, compare profiles, and manage a recruitment pipeline.
- **Institution placement intelligence** — Monitor placement funnels, skill demand, training needs, and outcomes.
- **Admin governance** — Moderate opportunities, verify profiles, inspect system health, and review usage analytics.
- **Responsive animated interface** — Framer Motion transitions and Tailwind CSS keep the experience clear and engaging across devices.

## Technology

- Next.js 14 App Router, React 18, and TypeScript
- Tailwind CSS, Framer Motion, and Lucide icons
- Supabase PostgreSQL, authentication, storage, and Row-Level Security
- Google Gemini for assistive career and interview intelligence
- Recharts for analytics and data visualisation

## Running locally

### Prerequisites

- Node.js 18 or newer
- npm
- A Supabase project
- A Google Gemini API key for AI features

### Setup

1. Clone the repository and enter the project directory:

   ```bash
   git clone https://github.com/samratc252007/cyclops.git
   cd cyclops
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create your local environment file:

   ```bash
   copy .env.example .env.local
   ```

   On macOS or Linux, use `cp .env.example .env.local` instead. Add your Supabase and Gemini credentials to `.env.local`. Never commit this file.

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000).

### Quality checks

```bash
npm run typecheck
npm run lint
npm run build
```

## Team

Created by **Samrat Choudhury, Pallavi CJ, Sanjana SD, and Rohit Nagaraj Bhat**.

## Project support

For project-related queries, email **adminmockinterview@gmail.com**.

## Event

**Ramaiah University of Applied Sciences — SIH Internal Hackathon 2026**  
**Date:** 16 September 2026
