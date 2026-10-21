#!/bin/bash
echo "==================================================="
echo "  Smart Attendance Predictor - KGiSL / Litz Tech"
echo "  Student: Gowdham S (711724UAD133)"
echo "==================================================="

if [ ! -d "node_modules" ]; then
    echo "[1/2] Installing dependencies..."
    npm install
fi

echo "[2/2] Starting Development Server on http://localhost:3000..."
npm run dev
