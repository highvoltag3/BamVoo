const Alexa = require('ask-sdk-core');
const axios = require('axios');
const moment = require('moment');

// OctoEverywhere API Configuration
const OCTO_API_BASE = 'https://octoeverywhere.com/api/appconnection/v1';
const APP_TOKEN = process.env.OCTO_APP_TOKEN; // Set in Lambda environment variables

// API Helper Functions
class OctoEverywhereAPI {
    constructor() {
        this.client = axios.create({
            baseURL: OCTO_API_BASE,
            headers: {
                'AppToken': APP_TOKEN,
                'Content-Type': 'application/json'
            }
        });
    }

    async getPrinters() {
        try {
            const response = await this.client.get('/printer');
            return response.data;
        } catch (error) {
            console.error('Error fetching printers:', error);
            throw new Error('Failed to fetch printers');
        }
    }

    async getPrinterState(printerId) {
        try {
            const response = await this.client.get(`/printer/${printerId}/state`);
            return response.data;
        } catch (error) {
            console.error('Error fetching printer state:', error);
            throw new Error('Failed to fetch printer state');
        }
    }

    async getWebcamSnapshot(printerId) {
        try {
            const response = await this.client.get(`/printer/${printerId}/webcam`);
            return response.data;
        } catch (error) {
            console.error('Error fetching webcam snapshot:', error);
            throw new Error('Failed to fetch webcam snapshot');
        }
    }
}

// Utility Functions
function formatTimeRemaining(seconds) {
    if (!seconds || seconds <= 0) return 'less than a minute';
    
    const duration = moment.duration(seconds, 'seconds');
    const hours = Math.floor(duration.asHours());
    const minutes = duration.minutes();
    
    if (hours > 0) {
        return `${hours} hour${hours > 1 ? 's' : ''} and ${minutes} minute${minutes !== 1 ? 's' : ''}`;
    } else {
        return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }
}

function formatProgress(percent) {
    return `${Math.round(percent)} percent`;
}

// Intent Handlers
const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Welcome to BamVoo. You can ask me about your printer status, progress, or time remaining. For example, say "How far along is my X1C?" or "What\'s the status of my Mini?"';
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('What would you like to know about your printer?')
            .getResponse();
    }
};

const GetPrintersHandler = {
    canHandle(handlerInput) {
        return Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetPrintersIntent';
    },
    async handle(handlerInput) {
        const api = new OctoEverywhereAPI();
        
        try {
            const printers = await api.getPrinters();
            
            if (!printers || printers.length === 0) {
                return handlerInput.responseBuilder
                    .speak('No printers found. Please make sure your printers are connected to OctoEverywhere.')
                    .getResponse();
            }
            
            if (printers.length === 1) {
                const printer = printers[0];
                const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
                sessionAttributes.selectedPrinter = printer;
                handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
                
                return handlerInput.responseBuilder
                    .speak(`Found your printer: ${printer.name}. What would you like to know about it?`)
                    .reprompt('You can ask about status, progress, or time remaining.')
                    .getResponse();
            } else {
                const printerNames = printers.map(p => p.name).join(', ');
                const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
                sessionAttributes.availablePrinters = printers;
                handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
                
                return handlerInput.responseBuilder
                    .speak(`You have ${printers.length} printers: ${printerNames}. Which one would you like to check?`)
                    .reprompt('Please specify which printer you want to check.')
                    .getResponse();
            }
        } catch (error) {
            return handlerInput.responseBuilder
                .speak('Sorry, I couldn\'t fetch your printers right now. Please try again later.')
                .getResponse();
        }
    }
};

const PrinterSelectionHandler = {
    canHandle(handlerInput) {
        return Alexa.getIntentName(handlerInput.requestEnvelope) === 'PrinterSelectionIntent';
    },
    handle(handlerInput) {
        const printerName = Alexa.getSlotValue(handlerInput.requestEnvelope, 'PrinterName');
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const availablePrinters = sessionAttributes.availablePrinters;
        
        if (!availablePrinters) {
            return handlerInput.responseBuilder
                .speak('Please ask me to check your printers first.')
                .getResponse();
        }
        
        const selectedPrinter = availablePrinters.find(p => 
            p.name.toLowerCase().includes(printerName.toLowerCase()) ||
            printerName.toLowerCase().includes(p.name.toLowerCase())
        );
        
        if (!selectedPrinter) {
            return handlerInput.responseBuilder
                .speak(`I couldn't find a printer named ${printerName}. Please try again.`)
                .reprompt('Which printer would you like to check?')
                .getResponse();
        }
        
        sessionAttributes.selectedPrinter = selectedPrinter;
        sessionAttributes.availablePrinters = null;
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
        
        return handlerInput.responseBuilder
            .speak(`Selected ${selectedPrinter.name}. What would you like to know about it?`)
            .reprompt('You can ask about status, progress, or time remaining.')
            .getResponse();
    }
};

const GetPrinterStatusHandler = {
    canHandle(handlerInput) {
        return Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetPrinterStatusIntent';
    },
    async handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const selectedPrinter = sessionAttributes.selectedPrinter;
        
        if (!selectedPrinter) {
            return handlerInput.responseBuilder
                .speak('Please specify which printer you want to check. You can say "check my printers" to see available options.')
                .getResponse();
        }
        
        const api = new OctoEverywhereAPI();
        
        try {
            const state = await api.getPrinterState(selectedPrinter.id);
            const printerState = state.printer.state;
            
            let speakOutput = `${selectedPrinter.name} is currently ${printerState.toLowerCase()}`;
            
            if (printerState === 'Printing' && state.printer.progress) {
                const progress = formatProgress(state.printer.progress.percent);
                speakOutput += `. The print is ${progress} complete`;
                
                if (state.printer.time_remaining) {
                    const timeRemaining = formatTimeRemaining(state.printer.time_remaining);
                    speakOutput += ` with ${timeRemaining} remaining`;
                }
            }
            
            speakOutput += '.';
            
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .getResponse();
        } catch (error) {
            return handlerInput.responseBuilder
                .speak(`Sorry, I couldn't get the status of ${selectedPrinter.name} right now. Please try again later.`)
                .getResponse();
        }
    }
};

const GetPrintProgressHandler = {
    canHandle(handlerInput) {
        return Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetPrintProgressIntent';
    },
    async handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const selectedPrinter = sessionAttributes.selectedPrinter;
        
        if (!selectedPrinter) {
            return handlerInput.responseBuilder
                .speak('Please specify which printer you want to check. You can say "check my printers" to see available options.')
                .getResponse();
        }
        
        const api = new OctoEverywhereAPI();
        
        try {
            const state = await api.getPrinterState(selectedPrinter.id);
            
            if (state.printer.state !== 'Printing') {
                return handlerInput.responseBuilder
                    .speak(`${selectedPrinter.name} is not currently printing. It's ${state.printer.state.toLowerCase()}.`)
                    .getResponse();
            }
            
            if (!state.printer.progress) {
                return handlerInput.responseBuilder
                    .speak(`${selectedPrinter.name} is printing, but I don't have progress information available.`)
                    .getResponse();
            }
            
            const progress = formatProgress(state.printer.progress.percent);
            let speakOutput = `${selectedPrinter.name} is ${progress} complete`;
            
            if (state.printer.time_remaining) {
                const timeRemaining = formatTimeRemaining(state.printer.time_remaining);
                speakOutput += ` with ${timeRemaining} remaining`;
            }
            
            speakOutput += '.';
            
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .getResponse();
        } catch (error) {
            return handlerInput.responseBuilder
                .speak(`Sorry, I couldn't get the progress of ${selectedPrinter.name} right now. Please try again later.`)
                .getResponse();
        }
    }
};

const GetTimeRemainingHandler = {
    canHandle(handlerInput) {
        return Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetTimeRemainingIntent';
    },
    async handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const selectedPrinter = sessionAttributes.selectedPrinter;
        
        if (!selectedPrinter) {
            return handlerInput.responseBuilder
                .speak('Please specify which printer you want to check. You can say "check my printers" to see available options.')
                .getResponse();
        }
        
        const api = new OctoEverywhereAPI();
        
        try {
            const state = await api.getPrinterState(selectedPrinter.id);
            
            if (state.printer.state !== 'Printing') {
                return handlerInput.responseBuilder
                    .speak(`${selectedPrinter.name} is not currently printing. It's ${state.printer.state.toLowerCase()}.`)
                    .getResponse();
            }
            
            if (!state.printer.time_remaining) {
                return handlerInput.responseBuilder
                    .speak(`${selectedPrinter.name} is printing, but I don't have time remaining information available.`)
                    .getResponse();
            }
            
            const timeRemaining = formatTimeRemaining(state.printer.time_remaining);
            const progress = state.printer.progress ? formatProgress(state.printer.progress.percent) : 'unknown progress';
            
            return handlerInput.responseBuilder
                .speak(`${selectedPrinter.name} has ${timeRemaining} remaining and is ${progress} complete.`)
                .getResponse();
        } catch (error) {
            return handlerInput.responseBuilder
                .speak(`Sorry, I couldn't get the time remaining for ${selectedPrinter.name} right now. Please try again later.`)
                .getResponse();
        }
    }
};

const GetWebcamSnapshotHandler = {
    canHandle(handlerInput) {
        return Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetWebcamSnapshotIntent';
    },
    async handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const selectedPrinter = sessionAttributes.selectedPrinter;
        
        if (!selectedPrinter) {
            return handlerInput.responseBuilder
                .speak('Please specify which printer you want to check. You can say "check my printers" to see available options.')
                .getResponse();
        }
        
        const api = new OctoEverywhereAPI();
        
        try {
            const snapshot = await api.getWebcamSnapshot(selectedPrinter.id);
            
            if (!snapshot || !snapshot.url) {
                return handlerInput.responseBuilder
                    .speak(`${selectedPrinter.name} doesn't have a webcam or the snapshot is not available.`)
                    .getResponse();
            }
            
            return handlerInput.responseBuilder
                .speak(`I've captured a snapshot from ${selectedPrinter.name}. You can view it in the Alexa app.`)
                .addDirective({
                    type: 'Alexa.Presentation.APL',
                    document: {
                        type: 'APL',
                        version: '1.8',
                        mainTemplate: {
                            parameters: {
                                payload: {
                                    imageUrl: snapshot.url
                                }
                            },
                            items: [{
                                type: 'Image',
                                source: '${payload.imageUrl}',
                                width: '100%',
                                height: '100%'
                            }]
                        }
                    }
                })
                .getResponse();
        } catch (error) {
            return handlerInput.responseBuilder
                .speak(`Sorry, I couldn't get a snapshot from ${selectedPrinter.name} right now. Please try again later.`)
                .getResponse();
        }
    }
};

const HelpHandler = {
    canHandle(handlerInput) {
        return Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can ask me to check your printers, get print status, progress, or time remaining. For example, say "Check my printers", "How far along is my X1C?", or "What\'s the status of my Mini?". You can also ask for a webcam snapshot by saying "Show me a snapshot from my printer".';
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('What would you like to know about your printer?')
            .getResponse();
    }
};

const CancelAndStopHandler = {
    canHandle(handlerInput) {
        return Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent' ||
               Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        return handlerInput.responseBuilder.getResponse();
    }
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);
        
        return handlerInput.responseBuilder
            .speak('Sorry, I had trouble doing what you asked. Please try again.')
            .reprompt('What would you like to know about your printer?')
            .getResponse();
    }
};

// Lambda Handler
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        GetPrintersHandler,
        PrinterSelectionHandler,
        GetPrinterStatusHandler,
        GetPrintProgressHandler,
        GetTimeRemainingHandler,
        GetWebcamSnapshotHandler,
        HelpHandler,
        CancelAndStopHandler,
        SessionEndedRequestHandler
    )
    .addErrorHandlers(ErrorHandler)
    .lambda(); 