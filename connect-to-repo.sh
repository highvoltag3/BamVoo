#!/bin/bash

# Connect BamVoo to existing GitHub repository

set -e

echo "🔗 Connecting BamVoo to your existing GitHub repository..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📥 Initializing git repository..."
    git init
fi

# Get the repository URL
echo "❓ Please enter your existing GitHub repository URL:"
echo "   Example: https://github.com/yourusername/bamvoo.git"
echo "   or: git@github.com:yourusername/bamvoo.git"
read -p "GitHub URL: " github_url

if [ -z "$github_url" ]; then
    echo "❌ No URL provided. Exiting."
    exit 1
fi

# Add remote origin
echo "🔗 Adding remote origin..."
git remote add origin "$github_url"

# Rename branch to main
echo "🌿 Renaming branch to main..."
git branch -M main

# Add all files
echo "📁 Adding files to git..."
git add .

# Create initial commit
echo "📝 Creating initial commit..."
git commit -m "feat: Initial BamVoo Alexa skill

- Alexa skill for monitoring Bambu Lab printers
- Multi-printer support with voice commands
- OctoEverywhere API integration
- Proactive notifications
- Webcam snapshot support
- Automated CI/CD pipeline"

# Create develop branch
echo "🌿 Creating develop branch..."
git checkout -b develop

# Push both branches
echo "📤 Pushing to GitHub..."
git push -u origin main
git push -u origin develop

echo ""
echo "✅ Successfully connected to your GitHub repository!"
echo ""
echo "📋 Next steps:"
echo "1. Go to your GitHub repository: $github_url"
echo "2. Go to Settings → Secrets and variables → Actions"
echo "3. Add the required secrets (see CI-CD-SETUP.md)"
echo "4. Push to develop branch to trigger staging deployment"
echo ""
echo "🔗 Useful links:"
echo "- CI/CD Setup Guide: CI-CD-SETUP.md"
echo "- Testing Guide: TESTING.md"
echo "- Main README: README.md"
echo ""
echo "🎉 Your automated pipeline will be ready once you add the secrets!" 