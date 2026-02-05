# SPORTIKON Arena

A multi-sport live scoring and tournament tracking platform built with Next.js 14, Supabase, and Tailwind CSS.

## 🏆 Features

### User Portal (Public)
- **Live Scores**: Real-time score updates with auto-refresh
- **Fixtures**: View upcoming, live, and completed matches
- **Standings**: Points tables for all sports
- **News**: Tournament news and announcements
- **Match Details**: Comprehensive match information

### Admin Portal (Protected)
- **Dashboard**: Overview of matches, scores, and activity
- **Live Scoring**: Real-time score updates during matches
- **Fixtures Management**: CRUD operations for all fixtures
- **Teams Management**: Add and manage participating teams
- **Standings**: Manage points tables
- **News Publishing**: Create and publish tournament news
- **Audit Logs**: Track all database changes
- **Venues**: Manage match venues
- **Settings**: Admin profile and preferences

### Sports Supported
- � Table Tennis
- ⚽ Football
- 🏀 Basketball
- 🏸 Badminton
- 🏐 Volleyball

## 🚀 Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS with custom sport-themed colors
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Real-time**: Supabase Realtime + Polling fallback
- **Icons**: Lucide React
- **Deployment**: AWS EC2 + NGINX

## 📁 Project Structure

```
sportikon/
├── database/
│   └── schema.sql          # Complete database schema
├── docs/
│   └── DEPLOYMENT.md       # AWS EC2 deployment guide
├── src/
│   ├── app/
│   │   ├── (user)/         # Public user portal pages
│   │   ├── (admin)/        # Protected admin portal pages
│   │   └── api/            # API routes
│   ├── components/
│   │   ├── ui/             # Reusable UI components
│   │   ├── user/           # User portal components
│   │   └── admin/          # Admin portal components
│   └── lib/
│       ├── supabase/       # Supabase clients
│       ├── database.types.ts
│       ├── utils.ts
│       └── constants.ts
├── .env.example
├── next.config.js
├── tailwind.config.ts
└── tsconfig.json
```

## 🛠️ Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### 1. Clone Repository

```bash
git clone https://github.com/your-repo/sportikon.git
cd sportikon
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4. Set Up Database

1. Go to Supabase SQL Editor
2. Run `database/schema.sql`
3. Enable Realtime for: `fixtures`, `live_scores`, `news_of_the_day`

### 5. Create Admin User

1. Create user in Supabase Dashboard (Authentication → Users)
2. Run in SQL Editor:
```sql
UPDATE users SET role = 'super_admin' WHERE email = 'your-email@domain.com';
```

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the user portal.

Open [http://localhost:3000/arena-admin](http://localhost:3000/arena-admin) for the admin portal.

## 📱 Pages

### User Portal
| Route | Description |
|-------|-------------|
| `/` | Home page with live matches and news |
| `/live` | All live matches with real-time updates |
| `/fixtures` | Upcoming and completed fixtures |
| `/standings` | Points tables for all sports |
| `/news` | Tournament news |
| `/news/[id]` | Individual news article |
| `/match/[id]` | Match details |

### Admin Portal
| Route | Description |
|-------|-------------|
| `/arena-admin` | Dashboard |
| `/arena-admin/login` | Admin login |
| `/arena-admin/live-scoring` | Real-time score updates |
| `/arena-admin/fixtures` | Manage fixtures |
| `/arena-admin/teams` | Manage teams |
| `/arena-admin/standings` | Manage points tables |
| `/arena-admin/news` | Manage news |
| `/arena-admin/venues` | Manage venues |
| `/arena-admin/audit-logs` | View activity logs |
| `/arena-admin/settings` | Admin settings |

## 🔒 Security

- Row Level Security (RLS) enabled on all tables
- Admin portal protected with Supabase Auth
- Role-based access control (super_admin, admin, moderator)
- NGINX rate limiting configured
- All admin actions logged in audit_logs

## 🚀 Deployment

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for complete AWS EC2 + NGINX deployment instructions.

### Quick Deploy

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📊 Performance

- Optimized for 10,000+ concurrent users
- Real-time updates with < 3 second latency
- Server-side rendering for fast initial load
- Static asset caching
- Database indexes for fast queries

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Credits

- **GROUNDSHUNT x SPORTIKON 4.0**
- Built with ❤️ for sports enthusiasts
