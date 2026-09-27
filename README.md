# 📖 WordVault

A vocabulary-building tool that lets you save and learn new words as you browse the web.

## Features

- 🔍 Look up any word or phrase and get an AI-generated definition, synonyms, antonyms, and example sentence
- 📚 Organise words into books
- ✅ Mark words as mastered
- 📊 Track your weekly streak and progress
- 📧 Weekly email summary of new words learned
- 🔔 Push notifications for weekly summary
- 🌐 Available as a Chrome extension and a PWA (installable on Android/iOS)

## Tech Stack

### Backend
- **Runtime**: Node.js + Express
- **Database**: PostgreSQL (Neon) + Prisma ORM
- **Auth**: Clerk
- **AI**: Google Gemini API
- **Queue**: BullMQ + Upstash Redis
- **Email**: Brevo
- **Push**: Web Push (VAPID)
- **Hosting**: Render

### Frontend
- **Chrome Extension**: Vanilla JS
- **PWA**: Vanilla JS
- **Hosting**: Vercel
