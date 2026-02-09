#!/bin/bash

# MongoDB Installation Script for Ubuntu/Debian
# Run this script to install and start MongoDB

echo "🚀 Installing MongoDB Community Edition..."

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then
  echo "⚠️  This script requires sudo privileges. Please run with sudo."
  exit 1
fi

# Install prerequisites
echo "📦 Installing prerequisites..."
apt-get install -y gnupg curl

# Import MongoDB public GPG key
echo "🔑 Importing MongoDB GPG key..."
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
   gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg \
   --dearmor

# Create list file for MongoDB
echo "📝 Adding MongoDB repository..."
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
    tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update package list
echo "🔄 Updating package list..."
apt-get update

# Install MongoDB
echo "⬇️  Installing MongoDB packages..."
apt-get install -y mongodb-org

# Start MongoDB service
echo "▶️  Starting MongoDB service..."
systemctl start mongod

# Enable MongoDB to start on boot
echo "✅ Enabling MongoDB on boot..."
systemctl enable mongod

# Check status
echo ""
echo "📊 MongoDB Status:"
systemctl status mongod --no-pager

echo ""
echo "✅ MongoDB installation complete!"
echo ""
echo "📌 Quick Commands:"
echo "   Check status: sudo systemctl status mongod"
echo "   Start: sudo systemctl start mongod"
echo "   Stop: sudo systemctl stop mongod"
echo "   Restart: sudo systemctl restart mongod"
echo "   Connect: mongosh"
echo ""
echo "🎯 Next Steps:"
echo "   1. Run: npm run seed"
echo "   2. Start backend: npm start"
echo ""
