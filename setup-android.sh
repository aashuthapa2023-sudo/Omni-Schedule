#!/bin/bash
# ==============================================================================
# OmniNiche 24/7 Android Termux Auto-Setup Script
# ==============================================================================
# This script sets up Node.js, PM2 process manager, and starts the 24/7 worker.
# ==============================================================================

set -e

echo "🚀 [1/5] Updating Termux packages..."
pkg update -y && pkg upgrade -y

echo "📦 [2/5] Installing Node.js & Git..."
pkg install nodejs git -y

echo "🔧 [3/5] Installing dependencies & PM2 process manager..."
npm install
npm install -g pm2 tsx

echo "🔋 [4/5] Acquiring Termux Wake-Lock (Prevents phone from sleeping)..."
termux-wake-lock

echo "🌟 [5/5] Starting Web Studio (Port 3000) and 24/7 Worker with PM2..."
pm2 start "npm run dev" --name "quote-studio"
pm2 start worker.ts --interpreter tsx --name "quote-worker"
pm2 save

IP_ADDR=$(ifconfig wlan0 2>/dev/null | grep 'inet ' | awk '{print $2}' || hostname -I 2>/dev/null | awk '{print $1}' || echo "YOUR-PHONE-IP")

echo ""
echo "=========================================================================="
echo "✅ Setup Complete! Your Quote Studio & 24/7 Worker are Running in Termux!"
echo "=========================================================================="
echo "🖥️  HOW TO ACCESS THE STUDIO UI FROM YOUR PC:"
echo "1. Ensure both your Phone and PC are on the same Wi-Fi."
echo "2. Open your PC browser and navigate to:"
echo "   👉 http://${IP_ADDR}:3000"
echo ""
echo "• View Studio Web logs:  pm2 logs quote-studio"
echo "• View Worker logs:      pm2 logs quote-worker"
echo "• Check status:          pm2 status"
echo "• Restart all:           pm2 restart all"
echo "• Stop all:              pm2 stop all"
echo ""
echo "⚠️  CRITICAL ANDROID SETTINGS:"
echo "1. Disable Battery Optimization: Android Settings -> Apps -> Termux -> Battery -> Unrestricted."
echo "2. Lock Termux in Recent Apps so Android task manager does not clear it."
echo "=========================================================================="
