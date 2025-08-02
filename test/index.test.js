const Alexa = require('ask-sdk-core');

// Mock the handler function
const mockHandler = jest.fn();
jest.mock('../index', () => ({
    handler: mockHandler
}));

// Mock OctoEverywhere API responses
const mockPrinters = [
    { id: 'printer_1', name: 'X1C' },
    { id: 'printer_2', name: 'Mini' }
];

const mockPrinterState = {
    printer: {
        state: 'Printing',
        progress: { percent: 52.5 },
        time_remaining: 1500
    }
};

const mockWebcamSnapshot = {
    url: 'https://example.com/snapshot.jpg'
};

// Mock axios
jest.mock('axios', () => ({
    create: jest.fn(() => ({
        get: jest.fn()
    }))
}));

describe('BamVoo Alexa Skill', () => {
    let mockHandlerInput;
    let mockResponseBuilder;

    beforeEach(() => {
        mockResponseBuilder = {
            speak: jest.fn().mockReturnThis(),
            reprompt: jest.fn().mockReturnThis(),
            getResponse: jest.fn().mockReturnValue({}),
            addDirective: jest.fn().mockReturnThis()
        };

        mockHandlerInput = {
            requestEnvelope: {
                request: {
                    type: 'LaunchRequest'
                },
                session: {
                    attributes: {}
                }
            },
            attributesManager: {
                getSessionAttributes: jest.fn().mockReturnValue({}),
                setSessionAttributes: jest.fn()
            },
            responseBuilder: mockResponseBuilder
        };
    });

    describe('LaunchRequestHandler', () => {
        it('should provide welcome message and reprompt', async () => {
            mockHandlerInput.requestEnvelope.request.type = 'LaunchRequest';

            await handler(mockHandlerInput);

            expect(mockResponseBuilder.speak).toHaveBeenCalledWith(
                expect.stringContaining('Welcome to BamVoo')
            );
            expect(mockResponseBuilder.reprompt).toHaveBeenCalledWith(
                expect.stringContaining('What would you like to know')
            );
        });
    });

    describe('GetPrintersHandler', () => {
        it('should handle single printer scenario', async () => {
            mockHandlerInput.requestEnvelope.request.type = 'IntentRequest';
            mockHandlerInput.requestEnvelope.request.intent = {
                name: 'GetPrintersIntent'
            };

            // Mock successful API response
            const axios = require('axios');
            axios.create().get.mockResolvedValueOnce({
                data: [mockPrinters[0]]
            });

            await handler(mockHandlerInput);

            expect(mockResponseBuilder.speak).toHaveBeenCalledWith(
                expect.stringContaining('Found your printer: X1C')
            );
        });

        it('should handle multiple printers scenario', async () => {
            mockHandlerInput.requestEnvelope.request.type = 'IntentRequest';
            mockHandlerInput.requestEnvelope.request.intent = {
                name: 'GetPrintersIntent'
            };

            // Mock successful API response
            const axios = require('axios');
            axios.create().get.mockResolvedValueOnce({
                data: mockPrinters
            });

            await handler(mockHandlerInput);

            expect(mockResponseBuilder.speak).toHaveBeenCalledWith(
                expect.stringContaining('You have 2 printers: X1C, Mini')
            );
        });

        it('should handle API error gracefully', async () => {
            mockHandlerInput.requestEnvelope.request.type = 'IntentRequest';
            mockHandlerInput.requestEnvelope.request.intent = {
                name: 'GetPrintersIntent'
            };

            // Mock API error
            const axios = require('axios');
            axios.create().get.mockRejectedValueOnce(new Error('API Error'));

            await handler(mockHandlerInput);

            expect(mockResponseBuilder.speak).toHaveBeenCalledWith(
                expect.stringContaining('Sorry, I couldn\'t fetch your printers')
            );
        });
    });

    describe('PrinterSelectionHandler', () => {
        it('should select printer by name', async () => {
            mockHandlerInput.requestEnvelope.request.type = 'IntentRequest';
            mockHandlerInput.requestEnvelope.request.intent = {
                name: 'PrinterSelectionIntent',
                slots: {
                    PrinterName: {
                        value: 'X1C'
                    }
                }
            };

            // Mock session with available printers
            mockHandlerInput.attributesManager.getSessionAttributes.mockReturnValue({
                availablePrinters: mockPrinters
            });

            await handler(mockHandlerInput);

            expect(mockResponseBuilder.speak).toHaveBeenCalledWith(
                expect.stringContaining('Selected X1C')
            );
        });

        it('should handle invalid printer name', async () => {
            mockHandlerInput.requestEnvelope.request.type = 'IntentRequest';
            mockHandlerInput.requestEnvelope.request.intent = {
                name: 'PrinterSelectionIntent',
                slots: {
                    PrinterName: {
                        value: 'InvalidPrinter'
                    }
                }
            };

            // Mock session with available printers
            mockHandlerInput.attributesManager.getSessionAttributes.mockReturnValue({
                availablePrinters: mockPrinters
            });

            await handler(mockHandlerInput);

            expect(mockResponseBuilder.speak).toHaveBeenCalledWith(
                expect.stringContaining('I couldn\'t find a printer named InvalidPrinter')
            );
        });
    });

    describe('GetPrinterStatusHandler', () => {
        it('should return printer status when printing', async () => {
            mockHandlerInput.requestEnvelope.request.type = 'IntentRequest';
            mockHandlerInput.requestEnvelope.request.intent = {
                name: 'GetPrinterStatusIntent'
            };

            // Mock session with selected printer
            mockHandlerInput.attributesManager.getSessionAttributes.mockReturnValue({
                selectedPrinter: mockPrinters[0]
            });

            // Mock successful API response
            const axios = require('axios');
            axios.create().get.mockResolvedValueOnce({
                data: mockPrinterState
            });

            await handler(mockHandlerInput);

            expect(mockResponseBuilder.speak).toHaveBeenCalledWith(
                expect.stringContaining('X1C is currently printing')
            );
        });

        it('should handle missing selected printer', async () => {
            mockHandlerInput.requestEnvelope.request.type = 'IntentRequest';
            mockHandlerInput.requestEnvelope.request.intent = {
                name: 'GetPrinterStatusIntent'
            };

            // Mock session without selected printer
            mockHandlerInput.attributesManager.getSessionAttributes.mockReturnValue({});

            await handler(mockHandlerInput);

            expect(mockResponseBuilder.speak).toHaveBeenCalledWith(
                expect.stringContaining('Please specify which printer')
            );
        });
    });

    describe('GetPrintProgressHandler', () => {
        it('should return progress when printing', async () => {
            mockHandlerInput.requestEnvelope.request.type = 'IntentRequest';
            mockHandlerInput.requestEnvelope.request.intent = {
                name: 'GetPrintProgressIntent'
            };

            // Mock session with selected printer
            mockHandlerInput.attributesManager.getSessionAttributes.mockReturnValue({
                selectedPrinter: mockPrinters[0]
            });

            // Mock successful API response
            const axios = require('axios');
            axios.create().get.mockResolvedValueOnce({
                data: mockPrinterState
            });

            await handler(mockHandlerInput);

            expect(mockResponseBuilder.speak).toHaveBeenCalledWith(
                expect.stringContaining('X1C is 53 percent complete')
            );
        });

        it('should handle printer not printing', async () => {
            mockHandlerInput.requestEnvelope.request.type = 'IntentRequest';
            mockHandlerInput.requestEnvelope.request.intent = {
                name: 'GetPrintProgressIntent'
            };

            // Mock session with selected printer
            mockHandlerInput.attributesManager.getSessionAttributes.mockReturnValue({
                selectedPrinter: mockPrinters[0]
            });

            // Mock printer state as idle
            const axios = require('axios');
            axios.create().get.mockResolvedValueOnce({
                data: {
                    printer: {
                        state: 'Idle'
                    }
                }
            });

            await handler(mockHandlerInput);

            expect(mockResponseBuilder.speak).toHaveBeenCalledWith(
                expect.stringContaining('X1C is not currently printing')
            );
        });
    });

    describe('GetTimeRemainingHandler', () => {
        it('should return time remaining when printing', async () => {
            mockHandlerInput.requestEnvelope.request.type = 'IntentRequest';
            mockHandlerInput.requestEnvelope.request.intent = {
                name: 'GetTimeRemainingIntent'
            };

            // Mock session with selected printer
            mockHandlerInput.attributesManager.getSessionAttributes.mockReturnValue({
                selectedPrinter: mockPrinters[0]
            });

            // Mock successful API response
            const axios = require('axios');
            axios.create().get.mockResolvedValueOnce({
                data: mockPrinterState
            });

            await handler(mockHandlerInput);

            expect(mockResponseBuilder.speak).toHaveBeenCalledWith(
                expect.stringContaining('X1C has 25 minutes remaining')
            );
        });
    });

    describe('GetWebcamSnapshotHandler', () => {
        it('should return webcam snapshot when available', async () => {
            mockHandlerInput.requestEnvelope.request.type = 'IntentRequest';
            mockHandlerInput.requestEnvelope.request.intent = {
                name: 'GetWebcamSnapshotIntent'
            };

            // Mock session with selected printer
            mockHandlerInput.attributesManager.getSessionAttributes.mockReturnValue({
                selectedPrinter: mockPrinters[0]
            });

            // Mock successful API response
            const axios = require('axios');
            axios.create().get.mockResolvedValueOnce({
                data: mockWebcamSnapshot
            });

            await handler(mockHandlerInput);

            expect(mockResponseBuilder.speak).toHaveBeenCalledWith(
                expect.stringContaining('I\'ve captured a snapshot from X1C')
            );
            expect(mockResponseBuilder.addDirective).toHaveBeenCalled();
        });

        it('should handle missing webcam', async () => {
            mockHandlerInput.requestEnvelope.request.type = 'IntentRequest';
            mockHandlerInput.requestEnvelope.request.intent = {
                name: 'GetWebcamSnapshotIntent'
            };

            // Mock session with selected printer
            mockHandlerInput.attributesManager.getSessionAttributes.mockReturnValue({
                selectedPrinter: mockPrinters[0]
            });

            // Mock API response without snapshot
            const axios = require('axios');
            axios.create().get.mockResolvedValueOnce({
                data: {}
            });

            await handler(mockHandlerInput);

            expect(mockResponseBuilder.speak).toHaveBeenCalledWith(
                expect.stringContaining('doesn\'t have a webcam')
            );
        });
    });

    describe('HelpHandler', () => {
        it('should provide help information', async () => {
            mockHandlerInput.requestEnvelope.request.type = 'IntentRequest';
            mockHandlerInput.requestEnvelope.request.intent = {
                name: 'AMAZON.HelpIntent'
            };

            await handler(mockHandlerInput);

            expect(mockResponseBuilder.speak).toHaveBeenCalledWith(
                expect.stringContaining('You can ask me to check your printers')
            );
        });
    });

    describe('CancelAndStopHandler', () => {
        it('should provide goodbye message', async () => {
            mockHandlerInput.requestEnvelope.request.type = 'IntentRequest';
            mockHandlerInput.requestEnvelope.request.intent = {
                name: 'AMAZON.CancelIntent'
            };

            await handler(mockHandlerInput);

            expect(mockResponseBuilder.speak).toHaveBeenCalledWith('Goodbye!');
        });
    });
}); 