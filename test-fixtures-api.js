const http = require('http');

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/fixtures',
    method: 'GET',
};

const req = http.request(options, (res) => {
    let data = '';

    console.log(`StatusCode: ${res.statusCode}`);

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            console.log('Fixture count:', Array.isArray(json) ? json.length : 'not an array');
            if (Array.isArray(json) && json.length > 0) {
                console.log('First fixture:', JSON.stringify(json[0], null, 2));
            } else {
                console.log('Response:', data);
            }
        } catch (e) {
            console.log('Response (not JSON):', data);
        }
    });
});

req.on('error', (error) => {
    console.error('Error:', error);
});

req.end();
