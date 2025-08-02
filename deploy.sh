#!/bin/bash

# BamVoo Alexa Skill Deployment Script

set -e

echo "🚀 Starting deployment of BamVoo Alexa Skill..."

# Check if required environment variables are set
if [ -z "$OCTO_APP_TOKEN" ]; then
    echo "❌ Error: OCTO_APP_TOKEN environment variable is not set"
    echo "Please set your OctoEverywhere App Token:"
    echo "export OCTO_APP_TOKEN=your_token_here"
    exit 1
fi

if [ -z "$ALEXA_SKILL_ID" ]; then
    echo "❌ Error: ALEXA_SKILL_ID environment variable is not set"
    echo "Please set your Alexa Skill ID:"
    echo "export ALEXA_SKILL_ID=amzn1.ask.skill.your_skill_id"
    exit 1
fi

if [ -z "$ALEXA_ACCESS_TOKEN" ]; then
    echo "❌ Error: ALEXA_ACCESS_TOKEN environment variable is not set"
    echo "Please set your Alexa Access Token:"
    echo "export ALEXA_ACCESS_TOKEN=your_access_token_here"
    exit 1
fi

echo "✅ Environment variables validated"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run tests
echo "🧪 Running tests..."
npm test

# Deploy to AWS Lambda
echo "☁️ Deploying to AWS Lambda..."
serverless deploy --verbose

echo "✅ Deployment completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Update your Alexa skill endpoint with the Lambda ARN"
echo "2. Configure the webhook URL in OctoEverywhere"
echo "3. Test the skill in the Alexa Developer Console"
echo ""
echo "🔗 Useful links:"
echo "- Alexa Developer Console: https://developer.amazon.com/alexa/console/ask"
echo "- OctoEverywhere API Docs: https://octoeverywhere.stoplight.io/docs/octoeverywhere-api-docs" 