# Crestara Development Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### 1. Prerequisites
- Node.js 18+
- Docker (for PostgreSQL & Redis)
- Git

### 2. Clone & Install
```bash
git clone https://github.com/yourusername/crestara.git
cd crestara
bash setup.sh
```

### 3. Start Services
```bash
# Terminal 1: Database & Cache
docker-compose up -d

# Terminal 2: Frontend
npm run dev:frontend

# Terminal 3: Backend
npm run dev:backend
```

### 4. Access
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **PgAdmin**: http://localhost:5050

---

## 📝 Configure Environment

Edit `.env.local`:
```env
# Frontend
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001

# Backend
DATABASE_URL=postgresql://crestara:postgres@localhost:5432/crestara_dev
REDIS_URL=redis://localhost:6379
JWT_SECRET=dev-secret-key-32-chars-minimum
JWT_EXPIRY=7d
NODE_ENV=development
PORT=3001
```

---

## 🗄️ Database Commands

```bash
# Apply migrations
npm run db:migrate

# Reset database (careful!)
npm run db:reset

# Open Prisma Studio
npm run db:studio

# Seed initial data
npm run db:seed
```

---

## 🎯 First Time Setup Checklist

- [ ] Clone repository
- [ ] Run `bash setup.sh`
- [ ] Edit `.env.local`
- [ ] Start Docker: `docker-compose up -d`
- [ ] Apply migrations: `npm run db:migrate`
- [ ] Start frontend: `npm run dev:frontend`
- [ ] Start backend: `npm run dev:backend`
- [ ] Visit http://localhost:3000
- [ ] Create test account via UI
- [ ] Navigate to dashboard

---

## 🧪 Testing

```bash
# Frontend tests
npm run test:frontend

# Backend tests
npm run test:backend

# Coverage report
npm run test:coverage
```

---

## 📚 Project Structure

```
crestara/
├── frontend/        # Next.js web app
├── backend/         # NestJS API
├── shared/          # Shared types & validation
├── .env.example     # Environment template
├── docker-compose.yml # Local DB & Redis
└── package.json     # Root workspace config
```

---

## 🔗 Key Endpoints

### Public
- `GET /` - Landing page
- `POST /auth/signup` - Register
- `POST /auth/login` - Login

### Protected (Require JWT)
- `GET /auth/me` - Current user
- `GET /funding/coins` - Available coins
- `GET /casino/games` - Available games
- `GET /mining/packages` - Mining packages
- `GET /dashboard` - User dashboard

### Admin
- `GET /admin/overview` - Dashboard stats
- `GET /admin/users` - User list
- `GET /admin/transactions` - Transaction history

---

## 🐛 Debugging

### VS Code
1. Install TypeScript + ESLint extensions
2. Debug backend: `npm run debug:backend`
3. Debug frontend: `npm run debug:frontend`

### API Testing
Use Postman/Insomnia:
1. Login to get JWT token
2. Add header: `Authorization: Bearer {token}`
3. Test endpoints

### Database
- Open PgAdmin: http://localhost:5050
- Connect to postgres @ localhost:5432
- View/edit tables, run SQL queries

---

## 📖 Documentation Paths

- **Frontend Setup**: [./frontend/README.md](./frontend/README.md)
- **Backend Setup**: [./backend/README.md](./backend/README.md)
- **Database Schema**: [./backend/prisma/README.md](./backend/prisma/README.md)
- **Deployment Guide**: [./DEPLOYMENT.md](./DEPLOYMENT.md)
- **API Types**: [./shared/src/types.ts](./shared/src/types.ts)

---

## 💡 Common Issues

**Port 3000/3001 already in use?**
```bash
# Find and kill process
lsof -i :3000
kill -9 <PID>
```

**Database connection error?**
```bash
# Check Docker is running
docker ps

# Restart services
docker-compose restart postgres redis
```

**Node modules broken?**
```bash
# Clean reinstall
rm -rf node_modules
npm install
```

---

## 🎮 Test User Accounts

After seeding:
```
Email: user@test.com
Password: Test123456
```

---

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Run tests: `npm run test`
4. Run lint: `npm run lint`
5. Create Pull Request

---

## 📞 Support

- Discord: [Link TBD]
- Email: dev@crestara.io
- GitHub Issues: [Report bugs]

---

## 🎉 You're Ready!

Start developing the future of crypto trading! 🚀
