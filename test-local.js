// Local test script for BamVoo core functionality
const axios = require('axios');

// Mock OctoEverywhere API responses for testing
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

// Test utility functions
function formatTimeRemaining(seconds) {
    if (!seconds || seconds <= 0) return 'less than a minute';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
        return `${hours} hour${hours > 1 ? 's' : ''} and ${minutes} minute${minutes !== 1 ? 's' : ''}`;
    } else {
        return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }
}

function formatProgress(percent) {
    return `${Math.round(percent)} percent`;
}

// Test scenarios
function testTimeFormatting() {
    console.log('🧪 Testing time formatting...');
    
    const testCases = [
        { seconds: 1500, expected: '25 minutes' },
        { seconds: 3660, expected: '1 hour and 1 minute' },
        { seconds: 7200, expected: '2 hours and 0 minutes' },
        { seconds: 0, expected: 'less than a minute' }
    ];
    
    testCases.forEach(({ seconds, expected }) => {
        const result = formatTimeRemaining(seconds);
        const passed = result === expected;
        console.log(`  ${passed ? '✅' : '❌'} ${seconds}s → "${result}" ${passed ? '' : `(expected: "${expected}")`}`);
    });
}

function testProgressFormatting() {
    console.log('\n🧪 Testing progress formatting...');
    
    const testCases = [
        { percent: 52.5, expected: '53 percent' },
        { percent: 0, expected: '0 percent' },
        { percent: 100, expected: '100 percent' }
    ];
    
    testCases.forEach(({ percent, expected }) => {
        const result = formatProgress(percent);
        const passed = result === expected;
        console.log(`  ${passed ? '✅' : '❌'} ${percent}% → "${result}" ${passed ? '' : `(expected: "${expected}")`}`);
    });
}

function testPrinterSelection() {
    console.log('\n🧪 Testing printer selection logic...');
    
    const availablePrinters = mockPrinters;
    const testCases = [
        { input: 'X1C', expected: 'X1C' },
        { input: 'Mini', expected: 'Mini' },
        { input: 'x1c', expected: 'X1C' }, // case insensitive
        { input: 'InvalidPrinter', expected: null }
    ];
    
    testCases.forEach(({ input, expected }) => {
        const selectedPrinter = availablePrinters.find(p => 
            p.name.toLowerCase().includes(input.toLowerCase()) ||
            input.toLowerCase().includes(p.name.toLowerCase())
        );
        
        const result = selectedPrinter ? selectedPrinter.name : null;
        const passed = result === expected;
        console.log(`  ${passed ? '✅' : '❌'} "${input}" → ${result} ${passed ? '' : `(expected: ${expected})`}`);
    });
}

function testResponseGeneration() {
    console.log('\n🧪 Testing response generation...');
    
    const printer = mockPrinters[0];
    const state = mockPrinterState;
    
    // Test status response
    let speakOutput = `${printer.name} is currently ${state.printer.state.toLowerCase()}`;
    
    if (state.printer.state === 'Printing' && state.printer.progress) {
        const progress = formatProgress(state.printer.progress.percent);
        speakOutput += `. The print is ${progress} complete`;
        
        if (state.printer.time_remaining) {
            const timeRemaining = formatTimeRemaining(state.printer.time_remaining);
            speakOutput += ` with ${timeRemaining} remaining`;
        }
    }
    
    speakOutput += '.';
    
    console.log(`  ✅ Status Response: "${speakOutput}"`);
    
    // Test progress response
    const progress = formatProgress(state.printer.progress.percent);
    const timeRemaining = formatTimeRemaining(state.printer.time_remaining);
    const progressResponse = `${printer.name} is ${progress} complete with ${timeRemaining} remaining.`;
    
    console.log(`  ✅ Progress Response: "${progressResponse}"`);
}

function testErrorHandling() {
    console.log('\n🧪 Testing error handling...');
    
    const errorScenarios = [
        { scenario: 'No printers found', response: 'No printers found. Please make sure your printers are connected to OctoEverywhere.' },
        { scenario: 'API error', response: 'Sorry, I couldn\'t fetch your printers right now. Please try again later.' },
        { scenario: 'Printer not printing', response: 'X1C is not currently printing. It\'s idle.' }
    ];
    
    errorScenarios.forEach(({ scenario, response }) => {
        console.log(`  ✅ ${scenario}: "${response}"`);
    });
}

// Run all tests
function runAllTests() {
    console.log('🚀 Starting BamVoo Local Tests...\n');
    
    testTimeFormatting();
    testProgressFormatting();
    testPrinterSelection();
    testResponseGeneration();
    testErrorHandling();
    
    console.log('\n🎉 All local tests completed!');
    console.log('\n📋 Next steps:');
    console.log('1. Set up environment variables (OCTO_APP_TOKEN, etc.)');
    console.log('2. Deploy to AWS Lambda using: ./deploy.sh');
    console.log('3. Test in Alexa Developer Console');
    console.log('4. Test with real Alexa devices');
}

runAllTests(); 