# BamVoo Testing Guide

This guide covers all the different ways to test the BamVoo Alexa skill at various stages of development.

## 🧪 Local Testing

### 1. Core Functionality Tests

Run the local test script to verify core functionality:

```bash
node test-local.js
```

This tests:
- ✅ Time formatting (seconds to human-readable)
- ✅ Progress formatting (percentage display)
- ✅ Printer selection logic
- ✅ Response generation
- ✅ Error handling scenarios

### 2. Unit Tests

Run the Jest unit tests:

```bash
npm test
```

**Note**: The unit tests may have issues with the Alexa SDK version. The local tests above are more reliable for core functionality.

## 🚀 Deployment Testing

### 1. Environment Setup

Before deploying, set up your environment variables:

```bash
# OctoEverywhere Configuration
export OCTO_APP_TOKEN=your_octoeverywhere_app_token

# Alexa Configuration  
export ALEXA_SKILL_ID=amzn1.ask.skill.your_skill_id
export ALEXA_ACCESS_TOKEN=your_alexa_access_token
```

### 2. Deploy to AWS Lambda

```bash
# Make deploy script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

The deployment script will:
- ✅ Validate environment variables
- ✅ Install dependencies
- ✅ Run tests
- ✅ Deploy to AWS Lambda
- ✅ Provide next steps

### 3. Verify Deployment

Check that your Lambda function was created:

```bash
# List Lambda functions
aws lambda list-functions --query 'Functions[?contains(FunctionName, `bamvoo`)]'

# Check function status
aws lambda get-function --function-name bamvoo-dev-alexaSkill
```

## 🎯 Alexa Developer Console Testing

### 1. Configure Skill

1. Go to [Alexa Developer Console](https://developer.amazon.com/alexa/console/ask)
2. Create a new skill:
   - **Skill name**: BamVoo
   - **Invocation name**: bamvoo
   - **Endpoint**: Use the Lambda ARN from deployment

### 2. Import Interaction Model

1. Go to **Interaction Model** → **JSON Editor**
2. Copy and paste the contents of `skill.json`
3. Save and build the model

### 3. Test in Console

Use the **Test** tab to test your skill:

#### Sample Test Utterances:

```
"Alexa, open BamVoo"
"Check my printers"
"X1C"
"How far along is my printer?"
"What's the status?"
"How much time is left?"
"Show me a snapshot"
```

#### Expected Responses:

- **Launch**: "Welcome to BamVoo. You can ask me about your printer status, progress, or time remaining..."
- **Get Printers**: "You have X1C and Mini. Which one would you like to check?"
- **Printer Selection**: "Selected X1C. What would you like to know about it?"
- **Status**: "X1C is currently printing. The print is 53 percent complete with 25 minutes remaining."
- **Progress**: "X1C is 53 percent complete with 25 minutes remaining."
- **Time**: "X1C has 25 minutes remaining and is 53 percent complete."

## 📱 Real Device Testing

### 1. Enable Skill

1. Go to [Alexa Skills](https://www.amazon.com/alexa-skills)
2. Find "BamVoo" in your skills
3. Enable it for your account

### 2. Test Voice Commands

On your Alexa device, try these commands:

```
"Alexa, open BamVoo"
"Alexa, ask BamVoo to check my printers"
"Alexa, ask BamVoo how far along my X1C is"
"Alexa, ask BamVoo what's the status of my Mini"
"Alexa, ask BamVoo how much time is left"
"Alexa, ask BamVoo to show me a snapshot"
```

### 3. Test Multi-Printer Scenarios

If you have multiple printers:

```
User: "Alexa, open BamVoo"
Alexa: "Welcome to BamVoo..."

User: "Check my printers"
Alexa: "You have X1C and Mini. Which one would you like to check?"

User: "X1C"
Alexa: "Selected X1C. What would you like to know about it?"

User: "How far along is it?"
Alexa: "X1C is 53 percent complete with 25 minutes remaining."
```

## 🔧 API Testing

### 1. Test OctoEverywhere API

Test the API endpoints directly:

```bash
# Test printer list
curl -H "AppToken: your_token" \
  https://octoeverywhere.com/api/appconnection/v1/printer

# Test printer state
curl -H "AppToken: your_token" \
  https://octoeverywhere.com/api/appconnection/v1/printer/printer_id/state

# Test webcam snapshot
curl -H "AppToken: your_token" \
  https://octoeverywhere.com/api/appconnection/v1/printer/printer_id/webcam
```

### 2. Test Webhook Handler

Test the webhook notifications:

```bash
# Test print finished event
curl -X POST https://your-api-gateway-url.amazonaws.com/dev/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "type": "PrintFinished",
    "printer": {
      "id": "printer_123",
      "name": "X1C"
    }
  }'
```

## 🐛 Debugging

### 1. CloudWatch Logs

View Lambda function logs:

```bash
# View recent logs
serverless logs -f alexaSkill -t

# View webhook logs
serverless logs -f webhookHandler -t
```

### 2. Common Issues

#### "No printers found"
- ✅ Verify OctoEverywhere App Token is correct
- ✅ Ensure printers are connected via Bambu Connect
- ✅ Check API permissions

#### "Failed to fetch printer state"
- ✅ Verify printer is online
- ✅ Check OctoEverywhere connection
- ✅ Review API response format

#### "Notifications not working"
- ✅ Verify Alexa Notifications API is enabled
- ✅ Check user permissions
- ✅ Ensure webhook URL is accessible

### 3. Environment Variables

Verify all required environment variables are set:

```bash
echo $OCTO_APP_TOKEN
echo $ALEXA_SKILL_ID
echo $ALEXA_ACCESS_TOKEN
```

## 📊 Test Coverage

The testing covers:

- ✅ **Core Functions**: Time formatting, progress formatting
- ✅ **API Integration**: OctoEverywhere API calls
- ✅ **Intent Handling**: All Alexa intents
- ✅ **Error Handling**: API failures, missing data
- ✅ **Multi-Printer**: Printer selection logic
- ✅ **Session Management**: State persistence
- ✅ **Webhook Notifications**: Proactive alerts
- ✅ **Voice Responses**: Natural language output

## 🎯 Performance Testing

### 1. Response Time

Monitor Lambda response times:
- Target: < 3 seconds
- Acceptable: < 5 seconds
- Alert: > 10 seconds

### 2. API Limits

- OctoEverywhere API: Check rate limits
- Alexa API: Monitor usage quotas
- Lambda: Watch execution time and memory

## 📝 Test Checklist

Before going live, verify:

- [ ] Local tests pass
- [ ] Lambda deployment successful
- [ ] Alexa skill configured correctly
- [ ] Interaction model imported
- [ ] Voice commands work on real device
- [ ] Multi-printer scenarios tested
- [ ] Error handling verified
- [ ] Webhook notifications working
- [ ] Environment variables set
- [ ] API tokens valid
- [ ] CloudWatch logs clean

## 🚀 Ready for Production

Once all tests pass:

1. **Deploy to production**: `serverless deploy --stage prod`
2. **Submit for certification**: Follow Alexa skill certification process
3. **Monitor performance**: Set up CloudWatch alarms
4. **User feedback**: Collect and respond to user reviews

---

**Need help?** Check the [README.md](README.md) for setup instructions or create an issue in the repository. 