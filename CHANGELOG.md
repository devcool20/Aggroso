# Changelog - Aggroso

All notable changes and decisions made during the development of this project.

## [1.0.0] - 2026-02-12

### Added
- Initial release of Aggroso Meeting Action Items Tracker
- AI-powered transcript processing using Google Gemini 2.0 Flash
- Automatic extraction of tasks, owners, due dates, and tags
- CRUD operations for action items
- History tracking (last 5 transcripts)
- System health monitoring dashboard
- PostgreSQL database with Prisma ORM
- Vercel deployment configuration
- Comprehensive documentation

### Technical Decisions

#### Database Migration (SQLite → PostgreSQL)
**Initial Approach:**
- Started with SQLite for rapid local development
- Simple file-based database, no external dependencies

**Problem Encountered:**
- Vercel's serverless environment has read-only file system
- SQLite database file couldn't be created or written to at runtime
- All POST requests failed with "Unable to open database file" error

**Solution Implemented:**
- Migrated to PostgreSQL using Neon (cloud-hosted)
- Updated Prisma schema: `provider = "sqlite"` → `provider = "postgresql"`
- Created fresh migrations for PostgreSQL
- Updated build script to use `prisma migrate deploy`

**Benefits:**
- Persistent data storage across deployments
- Production-ready architecture
- Better scalability for future features
- No file system dependencies

#### AI Provider Selection
**Choice:** Google Gemini 2.0 Flash

**Reasons:**
- Fast response times (< 2 seconds for most transcripts)
- Excellent JSON parsing capabilities
- Generous free tier (1500 requests/day)
- Better quota limits than OpenAI for development

#### Framework Choices
- **Next.js 15**: Latest features, App Router, built-in API routes
- **Prisma**: Type-safe database queries, easy migrations
- **Tailwind CSS**: Rapid UI development, consistent design
- **Framer Motion**: Smooth animations for better UX

### Build Fixes Applied

1. **Next.js 15 Async Params**
   - Updated all dynamic route handlers to await params
   - Fixed TypeScript compilation errors

2. **Tailwind v4 Compatibility**
   - Reverted to standard Tailwind v3 syntax
   - Fixed PostCSS configuration issues
   - Resolved `@apply` directive conflicts

3. **Prisma Binary Targets**
   - Added `rhel-openssl-3.0.x` for Vercel compatibility
   - Ensured Prisma Client works in serverless environment

### Features

#### Core Functionality
- Paste meeting transcripts
- AI extracts action items automatically
- Edit, delete, and mark tasks as complete
- Filter tasks (All, Open, Done)
- View recent transcript history

#### Smart Tagging System
- AI automatically categorizes tasks
- Tags like "Backend", "Frontend", "Research", "Design"
- Visual tag display with icons

#### Health Monitoring
- Real-time status checks for:
  - Backend API
  - Database connectivity
  - AI service availability
- Color-coded status indicators

### Deployment
- Configured for Vercel deployment
- Automatic migrations on build
- Environment variable management
- Production-ready error handling

### Documentation
- `README.md`: Project overview and setup
- `AI_NOTES.md`: Technical decisions and AI implementation
- `DEPLOYMENT.md`: Step-by-step deployment guide
- `TRANSCRIPT_EXAMPLES.md`: Sample data for testing
- `ABOUTME.md`: Developer information

## Development Timeline

### Phase 1: Initial Setup
- Project scaffolding with Next.js 15
- Prisma schema design
- Basic UI components

### Phase 2: AI Integration
- Gemini API integration
- Prompt engineering for task extraction
- JSON parsing and validation

### Phase 3: Feature Development
- CRUD operations
- History tracking
- Tagging system
- Status monitoring

### Phase 4: Deployment Preparation
- Database migration (SQLite → PostgreSQL)
- Vercel configuration
- Environment variable setup
- Documentation

### Phase 5: Production Deployment
- Neon PostgreSQL setup
- Vercel deployment
- Testing and verification

## Known Limitations

1. **Free Tier Constraints**
   - Neon database auto-pauses after inactivity
   - Gemini API has rate limits (15 req/min)
   - Vercel has bandwidth limits

2. **AI Accuracy**
   - Depends on transcript quality
   - May miss implicit tasks
   - Date parsing can be inconsistent

3. **Scalability**
   - Current setup suitable for personal/small team use
   - Would need optimization for high-traffic scenarios

## Future Enhancements (Potential)

- [ ] User authentication and multi-tenancy
- [ ] Email notifications for due dates
- [ ] Export to CSV/PDF
- [ ] Integration with calendar apps
- [ ] Mobile app version
- [ ] Advanced filtering and search
- [ ] Team collaboration features
- [ ] Custom tag management

## Credits

- **Developer**: Divyanshu Sharma
- **AI Assistant**: Used for rapid development and problem-solving
- **Technologies**: Next.js, Prisma, PostgreSQL, Gemini AI, Vercel
