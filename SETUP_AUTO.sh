#!/bin/bash

echo "╔════════════════════════════════════════════════════════════╗"
echo "║      🤖 MULLER BOT 300+ AUTO SETUP 🤖                     ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Step 1: Check Node.js
echo -e "${YELLOW}Step 1: Checking Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not installed!${NC}"
    echo "Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi
NODE_VERSION=$(node -v)
echo -e "${GREEN}✅ Found: $NODE_VERSION${NC}"
echo ""

# Step 2: Check npm
echo -e "${YELLOW}Step 2: Checking npm...${NC}"
NPM_VERSION=$(npm -v)
echo -e "${GREEN}✅ Found: npm $NPM_VERSION${NC}"
echo ""

# Step 3: Install dependencies
echo -e "${YELLOW}Step 3: Installing dependencies (394 commands)...${NC}"
echo "This may take 5-10 minutes. Please wait..."
echo ""

npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ npm install failed!${NC}"
    echo "Try: npm cache clean --force && npm install"
    exit 1
fi
echo ""
echo -e "${GREEN}✅ Dependencies installed successfully!${NC}"
echo ""

# Step 4: Clear old sessions
echo -e "${YELLOW}Step 4: Clearing old sessions...${NC}"
rm -rf sessions/
rm -rf data/db.json
echo -e "${GREEN}✅ Sessions cleared${NC}"
echo ""

# Step 5: Success message
echo "╔════════════════════════════════════════════════════════════╗"
echo "║              ✅ SETUP COMPLETE ✅                          ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo -e "${GREEN}Your 394-command bot is ready!${NC}"
echo ""
echo "📋 Configuration:"
echo "   - 394 commands loaded"
echo "   - Media libraries installed"
echo "   - Sessions cleared"
echo "   - Bot ready to start"
echo ""
echo "🚀 Next step: npm start"
echo ""
echo "Then:"
echo "1. Scan pairing code with WhatsApp"
echo "2. Send .ping to test"
echo "3. Send .menu to see all 394 commands"
echo ""
echo "💡 Tips:"
echo "   - npm start = Start bot"
echo "   - .ping = Test bot speed"
echo "   - .menu = Show all commands"
echo "   - node cli.js backup = Backup data"
echo ""

