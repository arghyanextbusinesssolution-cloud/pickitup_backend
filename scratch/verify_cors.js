function getAllowedOrigins(frontendUrl) {
    const frontendUrls = frontendUrl ? frontendUrl.split(',').map(url => url.trim()) : [];
    const allowedOrigins = [
        ...frontendUrls,
        'http://localhost:3000'
    ].filter(Boolean);
    return allowedOrigins;
}

const testCases = [
    { input: 'https://pickitup.com,https://www.pickitup.com', expected: ['https://pickitup.com', 'https://www.pickitup.com', 'http://localhost:3000'] },
    { input: 'https://pickitup.com , https://www.pickitup.com ', expected: ['https://pickitup.com', 'https://www.pickitup.com', 'http://localhost:3000'] },
    { input: 'https://pickitup.com', expected: ['https://pickitup.com', 'http://localhost:3000'] },
    { input: '', expected: ['http://localhost:3000'] },
    { input: undefined, expected: ['http://localhost:3000'] }
];

testCases.forEach(({ input, expected }, index) => {
    const actual = getAllowedOrigins(input);
    const pass = JSON.stringify(actual) === JSON.stringify(expected);
    console.log(`Test Case ${index + 1}: ${pass ? 'PASS' : 'FAIL'}`);
    if (!pass) {
        console.log(`  Input: ${input}`);
        console.log(`  Expected: ${JSON.stringify(expected)}`);
        console.log(`  Actual:   ${JSON.stringify(actual)}`);
    }
});
