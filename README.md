# BamVoo - Alexa Skill

An Alexa skill that allows users to monitor their Bambu Lab 3D printers using voice commands via OctoEverywhere's cloud API.

## Features

- **Multi-Printer Support**: Handle multiple printers by name (e.g., "X1C", "Mini")
- **Real-time Status**: Get current printer state, print progress, and time remaining
- **Voice Responses**: Natural language responses for all printer queries
- **Proactive Notifications**: Alexa notifications for print completion and errors
- **Webcam Snapshots**: View printer webcam snapshots through Alexa app
- **Session Management**: Remember selected printer during conversation

## Prerequisites

1. **OctoEverywhere Account**: Your Bambu printers must be connected via Bambu Connect
2. **OctoEverywhere App Token**: Get your App Token from [OctoEverywhere API Docs](https://octoeverywhere.stoplight.io/docs/octoeverywhere-api-docs)
3. **AWS Account**: For Lambda deployment
4. **Alexa Developer Account**: For skill creation and management

## Setup Instructions

### 1. Environment Variables

Create a `.env` file with the following variables:

```bash
# OctoEverywhere Configuration
OCTO_APP_TOKEN=your_octoeverywhere_app_token

# Alexa Configuration
ALEXA_SKILL_ID=amzn1.ask.skill.your_skill_id
ALEXA_ACCESS_TOKEN=your_alexa_access_token
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Deploy to AWS Lambda

```bash
# Install Serverless Framework globally
npm install -g serverless

# Deploy the skill
serverless deploy
```

### 4. Configure Alexa Skill

1. Go to [Alexa Developer Console](https://developer.amazon.com/alexa/console/ask)
2. Create a new skill with the following settings:
   - **Skill name**: BamVoo
   - **Invocation name**: bamvoo
   - **Endpoint**: Use the Lambda ARN from deployment

3. Import the interaction model from `skill.json`

4. Configure the skill manifest with:
   - **Permissions**: Add "alexa::devices:all:read" for notifications
   - **APIs**: Enable Alexa Notifications API

### 5. Configure Webhook for Notifications

1. Set up the webhook URL in OctoEverywhere:
   - URL: `https://your-api-gateway-url.amazonaws.com/dev/webhook`
   - Events: PrintFinished, PrintFailed, PrintStarted, PrintPaused, PrintResumed

2. Configure Alexa Notifications:
   - Enable proactive notifications in your skill
   - Set up user permission handling

## Usage Examples

### Basic Commands

```
"Alexa, open BamVoo"
"Check my printers"
"How far along is my X1C?"
"What's the status of my Mini?"
"How much time is left on my printer?"
"Show me a snapshot from my printer"
```

### Multi-Printer Scenarios

```
User: "Check my printers"
Alexa: "You have X1C and Mini. Which one would you like to check?"

User: "X1C"
Alexa: "Selected X1C. What would you like to know about it?"

User: "How far along is it?"
Alexa: "X1C is 52 percent complete with 25 minutes remaining."
```

### Status Responses

- **Printing**: "X1C is currently printing. The print is 75 percent complete with 1 hour and 30 minutes remaining."
- **Idle**: "X1C is currently idle."
- **Error**: "X1C encountered an error and stopped printing."

## API Integration

### OctoEverywhere API Endpoints

- `GET /api/appconnection/v1/printer` - List user's printers
- `GET /api/appconnection/v1/printer/{printerId}/state` - Get printer state
- `GET /api/appconnection/v1/printer/{printerId}/webcam` - Get webcam snapshot

### Sample API Responses

```json
// Printer List
[
  {
    "id": "printer_123",
    "name": "X1C",
    "state": "Printing"
  }
]

// Printer State
{
  "printer": {
    "state": "Printing",
    "progress": {
      "percent": 52.5
    },
    "time_remaining": 1500
  }
}
```

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Alexa Device  │    │  AWS Lambda      │    │ OctoEverywhere  │
│                 │◄──►│  (index.js)      │◄──►│     API         │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌──────────────────┐
                       │  Webhook Handler │
                       │(webhook-handler.js)│
                       └──────────────────┘
```

## Testing

### Local Testing

```bash
# Test the Lambda function locally
npm test

# Test webhook handler
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -d '{"type":"PrintFinished","printer":{"name":"X1C"}}'
```

### Alexa Testing

1. Use the Alexa Developer Console test interface
2. Test with real Alexa devices
3. Verify proactive notifications work

## Troubleshooting

### Common Issues

1. **"No printers found"**
   - Verify OctoEverywhere App Token is correct
   - Ensure printers are connected via Bambu Connect
   - Check API permissions

2. **"Failed to fetch printer state"**
   - Verify printer is online
   - Check OctoEverywhere connection
   - Review API response format

3. **Notifications not working**
   - Verify Alexa Notifications API is enabled
   - Check user permissions
   - Ensure webhook URL is accessible

### Debugging

Enable CloudWatch logs to see detailed error messages:

```bash
# View Lambda logs
serverless logs -f alexaSkill -t

# View webhook logs
serverless logs -f webhookHandler -t
```

## Security Considerations

1. **Environment Variables**: Never commit API tokens to version control
2. **HTTPS**: All API calls use HTTPS
3. **Input Validation**: All user inputs are validated
4. **Error Handling**: Sensitive information is not exposed in error messages

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Create an issue in this repository
- Check OctoEverywhere documentation
- Review Alexa Skills Kit documentation 