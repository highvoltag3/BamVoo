#!/bin/bash

# BamVoo GitHub Repository Setup Script

set -e

echo "🚀 Setting up BamVoo GitHub repository for CI/CD..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📥 Initializing git repository..."
    git init
fi

# Check if remote exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "❓ Please enter your GitHub repository URL:"
    echo "   Example: https://github.com/yourusername/bamvoo.git"
    read -p "GitHub URL: " github_url
    
    if [ -n "$github_url" ]; then
        git remote add origin "$github_url"
        echo "✅ Remote origin added: $github_url"
    else
        echo "❌ No URL provided. Please add remote manually:"
        echo "   git remote add origin https://github.com/yourusername/bamvoo.git"
    fi
fi

# Create main branch if it doesn't exist
if ! git branch --list | grep -q "main"; then
    echo "🌿 Creating main branch..."
    git checkout -b main
fi

# Add all files
echo "📁 Adding files to git..."
git add .

# Initial commit
if ! git log --oneline | grep -q "Initial BamVoo"; then
    echo "📝 Creating initial commit..."
    git commit -m "Initial BamVoo Alexa skill

- Alexa skill for monitoring Bambu Lab printers
- Multi-printer support with voice commands
- OctoEverywhere API integration
- Proactive notifications
- Webcam snapshot support"
fi

# Create develop branch
if ! git branch --list | grep -q "develop"; then
    echo "🌿 Creating develop branch..."
    git checkout -b develop
    git push -u origin develop
fi

# Push to main
echo "📤 Pushing to main branch..."
git checkout main
git push -u origin main

echo ""
echo "✅ GitHub repository setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Go to your GitHub repository"
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