const Alexa = require('ask-sdk-core');
const { handler } = require('./index');

// Sample Alexa request for testing
const sampleLaunchRequest = {
    version: '1.0',
    session: {
        new: true,
        sessionId: 'amzn1.echo-api.session.test',
        application: {
            applicationId: 'amzn1.ask.skill.test'
        },
        user: {
            userId: 'amzn1.ask.account.test'
        }
    },
    context: {
        AudioPlayer: {
            playerActivity: 'IDLE'
        },
        System: {
            application: {
                applicationId: 'amzn1.ask.skill.test'
            },
            user: {
                userId: 'amzn1.ask.account.test'
            },
            device: {
                deviceId: 'amzn1.ask.device.test',
                supportedInterfaces: {
                    AudioPlayer: {}
                }
            }
        }
    },
    request: {
        type: 'LaunchRequest',
        requestId: 'amzn1.echo-api.request.test',
        timestamp: '2023-01-01T00:00:00Z',
        locale: 'en-US'
    }
};

const sampleGetPrintersRequest = {
    version: '1.0',
    session: {
        new: false,
        sessionId: 'amzn1.echo-api.session.test',
        application: {
            applicationId: 'amzn1.ask.skill.test'
        },
        user: {
            userId: 'amzn1.ask.account.test'
        }
    },
    context: {
        AudioPlayer: {
            playerActivity: 'IDLE'
        },
        System: {
            application: {
                applicationId: 'amzn1.ask.skill.test'
            },
            user: {
                userId: 'amzn1.ask.account.test'
            },
            device: {
                deviceId: 'amzn1.ask.device.test',
                supportedInterfaces: {
                    AudioPlayer: {}
                }
            }
        }
    },
    request: {
        type: 'IntentRequest',
        requestId: 'amzn1.echo-api.request.test',
        timestamp: '2023-01-01T00:00:00Z',
        locale: 'en-US',
        intent: {
            name: 'GetPrintersIntent',
            slots: {}
        }
    }
};

const samplePrinterSelectionRequest = {
    version: '1.0',
    session: {
        new: false,
        sessionId: 'amzn1.echo-api.session.test',
        application: {
            applicationId: 'amzn1.ask.skill.test'
        },
        user: {
            userId: 'amzn1.ask.account.test'
        }
    },
    context: {
        AudioPlayer: {
            playerActivity: 'IDLE'
        },
        System: {
            application: {
                applicationId: 'amzn1.ask.skill.test'
            },
            user: {
                userId: 'amzn1.ask.account.test'
            },
            device: {
                deviceId: 'amzn1.ask.device.test',
                supportedInterfaces: {
                    AudioPlayer: {}
                }
            }
        }
    },
    request: {
        type: 'IntentRequest',
        requestId: 'amzn1.echo-api.request.test',
        timestamp: '2023-01-01T00:00:00Z',
        locale: 'en-US',
        intent: {
            name: 'PrinterSelectionIntent',
            slots: {
                PrinterName: {
                    name: 'PrinterName',
                    value: 'X1C'
                }
            }
        }
    }
};

async function testSkill() {
    console.log('🧪 Testing BamVoo Alexa Skill...\n');

    try {
        // Test 1: Launch Request
        console.log('1️⃣ Testing Launch Request...');
        const launchResponse = await handler(sampleLaunchRequest, {});
        console.log('✅ Launch Response:', JSON.stringify(launchResponse, null, 2));
        console.log('');

        // Test 2: Get Printers Intent
        console.log('2️⃣ Testing Get Printers Intent...');
        const printersResponse = await handler(sampleGetPrintersRequest, {});
        console.log('✅ Get Printers Response:', JSON.stringify(printersResponse, null, 2));
        console.log('');

        // Test 3: Printer Selection Intent
        console.log('3️⃣ Testing Printer Selection Intent...');
        const selectionResponse = await handler(samplePrinterSelectionRequest, {});
        console.log('✅ Printer Selection Response:', JSON.stringify(selectionResponse, null, 2));
        console.log('');

        console.log('🎉 All tests completed successfully!');
    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

// Run the test
testSkill(); 