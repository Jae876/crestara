#!/bin/bash
# Initial setup script for Crestara development environment

echo "🚀 Initializing Crestara Platform..."

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install frontend
echo "📦 Installing frontend dependencies..."
cd frontend && npm install && cd ..

# Install backend
echo "📦 Installing backend dependencies..."
cd backend && npm install && cd ..

# Install shared
echo "📦 Installing shared dependencies..."
cd shared && npm install && cd ..

echo "✅ Dependencies installed!"

# Create .env files from examples
echo "📝 Creating environment files..."
if [ ! -f ".env.local" ]; then
  cp .env.example .env.local
  echo "✅ Created .env.local (edit with your config)"
fi

if [ ! -f "backend/.env.local" ]; then
  cp .env.example backend/.env.local
  echo "✅ Created backend/.env.local"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env.local with your database & API keys"
echo "2. Run: npm run dev (for development)"
echo ""
echo "📚 Documentation:"
echo "- Frontend: ./frontend/README.md"
echo "- Backend: ./backend/README.md"
echo "- Deployment: ./DEPLOYMENT.md"
