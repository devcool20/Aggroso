# Aggroso - Meeting Action Items Tracker

Aggroso is a web tool that helps you extract clear action items from meeting notes. It uses AI to identify tasks, assignees, due dates, and automatically categorize them with tags.

## Features
- **AI Extraction**: Uses Gemini 2.0 to find tasks in meeting transcripts.
- **Task Management**: Add, edit, delete, and check off tasks.
- **History**: Saves your last 5 transcripts for easy reference.
- **Smart Tagging**: Tasks are automatically tagged by category (Backend, UI, Research, etc.).
- **Health Monitoring**: Status page to check database and AI connectivity.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Database**: PostgreSQL (Neon) with Prisma ORM
- **AI**: Google Gemini 2.0 Flash
- **Styling**: Tailwind CSS & Framer Motion
- **Deployment**: Vercel

## Prerequisites
- Node.js 18+
- Gemini API key ([Get one here](https://aistudio.google.com/app/apikey))
- PostgreSQL database (Neon recommended for free tier)

## Local Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Aggroso
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Environment Variables**
   - Copy `.env.example` to `.env`
   - Add your `GEMINI_API_KEY`
   - Add your `DATABASE_URL` (PostgreSQL connection string)
     - For Neon: Create a free database at [neon.tech](https://neon.tech)
     - Copy the connection string from your Neon dashboard

4. **Run Database Migrations**
   ```bash
   npx prisma migrate dev
   ```

5. **Start the Development Server**
   ```bash
   npm run dev
   ```

6. **Open the app**
   - Navigate to `http://localhost:3000`

## Deploying to Vercel

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository

3. **Add Environment Variables**
   - In Vercel project settings → Environment Variables
   - Add `DATABASE_URL` (your Neon PostgreSQL connection string)
   - Add `GEMINI_API_KEY` (your Gemini API key)

4. **Deploy**
   - Vercel will automatically build and deploy
   - Migrations run automatically via the build script

## Testing

Sample transcripts are available in [TRANSCRIPT_EXAMPLES.md](./TRANSCRIPT_EXAMPLES.md). Copy any example and paste it into the app to test the AI extraction.

## How It Works

1. Paste a meeting transcript into the input box
2. Click "Generate Action Items"
3. AI extracts tasks, owners, due dates, and tags
4. Review, edit, or check off tasks
5. Access previous transcripts from the history sidebar

## Project Structure

```
Aggroso/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── transcripts/   # Transcript processing
│   │   ├── action-items/  # CRUD operations
│   │   └── health/        # System health check
│   ├── status/            # Status monitoring page
│   └── page.tsx           # Main application
├── components/            # React components
├── lib/                   # Utility functions
├── prisma/               # Database schema & migrations
└── public/               # Static assets
```

## Key Features Explained

### AI-Powered Extraction
- Uses Gemini 2.0 Flash for fast, accurate parsing
- Extracts tasks, owners, due dates, and categories
- Handles various transcript formats

### Database Architecture
- PostgreSQL for persistent, cloud-native storage
- Prisma ORM for type-safe database queries
- Automatic migrations on deployment

### Real-time Status Monitoring
- Backend API health check
- Database connectivity verification
- AI service availability check

## Development Notes

This project was built as a learning exercise in:
- Next.js 15 App Router
- AI integration (Gemini API)
- Database migrations (SQLite → PostgreSQL)
- Serverless deployment on Vercel
- Production-ready error handling

See [AI_NOTES.md](./AI_NOTES.md) for detailed technical decisions and challenges solved during development.

## License

MIT
