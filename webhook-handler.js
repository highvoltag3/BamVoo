const axios = require('axios');

// Alexa Notifications API Configuration
const ALEXA_API_BASE = 'https://api.amazonalexa.com';
const SKILL_ID = process.env.ALEXA_SKILL_ID;
const ACCESS_TOKEN = process.env.ALEXA_ACCESS_TOKEN;

class AlexaNotificationService {
    constructor() {
        this.client = axios.create({
            baseURL: ALEXA_API_BASE,
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
    }

    async sendNotification(userId, message) {
        try {
            const payload = {
                type: 'Messaging.Message',
                message: {
                    alexaSkill: {
                        skillId: SKILL_ID
                    },
                    pushNotification: {
                        status: 'ENABLED'
                    }
                },
                user: {
                    userId: userId
                },
                messageGroup: {
                    creator: {
                        name: 'BamVoo'
                    },
                    count: 1
                },
                message: {
                    title: 'BamVoo Printer Update',
                    body: message
                }
            };

            const response = await this.client.post('/v1/users/~current/sessions/active', payload);
            return response.data;
        } catch (error) {
            console.error('Error sending Alexa notification:', error);
            throw new Error('Failed to send notification');
        }
    }
}

// Webhook Event Handlers
class WebhookEventHandler {
    constructor() {
        this.notificationService = new AlexaNotificationService();
    }

    async handlePrintFinished(event) {
        const printerName = event.printer?.name || 'your printer';
        const message = `${printerName} just finished printing!`;
        
        // In a real implementation, you would look up the user's Alexa ID
        // from your database based on the printer ID
        const userId = await this.getUserIdFromPrinterId(event.printer?.id);
        
        if (userId) {
            await this.notificationService.sendNotification(userId, message);
        }
    }

    async handlePrintFailed(event) {
        const printerName = event.printer?.name || 'your printer';
        const message = `${printerName} encountered an error and stopped printing.`;
        
        const userId = await this.getUserIdFromPrinterId(event.printer?.id);
        
        if (userId) {
            await this.notificationService.sendNotification(userId, message);
        }
    }

    async handlePrintStarted(event) {
        const printerName = event.printer?.name || 'your printer';
        const message = `${printerName} has started printing.`;
        
        const userId = await this.getUserIdFromPrinterId(event.printer?.id);
        
        if (userId) {
            await this.notificationService.sendNotification(userId, message);
        }
    }

    async handlePrintPaused(event) {
        const printerName = event.printer?.name || 'your printer';
        const message = `${printerName} has been paused.`;
        
        const userId = await this.getUserIdFromPrinterId(event.printer?.id);
        
        if (userId) {
            await this.notificationService.sendNotification(userId, message);
        }
    }

    async handlePrintResumed(event) {
        const printerName = event.printer?.name || 'your printer';
        const message = `${printerName} has resumed printing.`;
        
        const userId = await this.getUserIdFromPrinterId(event.printer?.id);
        
        if (userId) {
            await this.notificationService.sendNotification(userId, message);
        }
    }

    // Helper method to get user ID from printer ID
    // In a real implementation, this would query your database
    async getUserIdFromPrinterId(printerId) {
        // This is a placeholder - you would implement database lookup here
        // For now, we'll return a mock user ID
        return 'mock-user-id';
    }
}

// Main webhook handler
exports.handler = async (event, context) => {
    console.log('Webhook event received:', JSON.stringify(event, null, 2));
    
    const eventHandler = new WebhookEventHandler();
    
    try {
        const eventType = event.type;
        
        switch (eventType) {
            case 'PrintFinished':
                await eventHandler.handlePrintFinished(event);
                break;
            case 'PrintFailed':
                await eventHandler.handlePrintFailed(event);
                break;
            case 'PrintStarted':
                await eventHandler.handlePrintStarted(event);
                break;
            case 'PrintPaused':
                await eventHandler.handlePrintPaused(event);
                break;
            case 'PrintResumed':
                await eventHandler.handlePrintResumed(event);
                break;
            default:
                console.log(`Unhandled event type: ${eventType}`);
        }
        
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Event processed successfully' })
        };
    } catch (error) {
        console.error('Error processing webhook event:', error);
        
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to process event' })
        };
    }
}; 