# Aggroso - Meeting Action Items Tracker

Aggroso is a simple web tool that helps you get clear action items from meeting notes. It uses AI to pick out tasks, who is responsible, and when they are due.

## Features
- **AI Extraction**: Uses Gemini 2.0 to find tasks in meeting transcripts.
- **Task Management**: You can add, edit, delete, and check off tasks.
- **History**: Saves your last 5 transcripts so you can see them later.
- **Tags**: Tasks are automatically tagged by category (like Backend, UI, etc.).
- **Health Check**: A status page to check if the database and AI are connected.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Database**: SQLite with Prisma
- **AI**: Google Gemini 2.0 Flash
- **Styling**: Tailwind CSS & Framer Motion

## Setup
1. **Clone the repo**
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Set up Environment**
   - Copy `.env.example` to `.env`.
   - Add your `GEMINI_API_KEY`.
4. **Setup Database**
   ```bash
   npx prisma migrate dev
   ```
5. **Run the app**
   ```bash
   npm run dev
   ```

## Workflow
1. Paste a meeting transcript in the box.
2. Click "Generate Action Items".
3. Review, edit, or check off the tasks that appear.
4. Check the history sidebar to switch between recent meetings.
