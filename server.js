const http = require('http');
const https = require('https');

const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    
    if (url.pathname === '/likes') {
        const universeId = url.searchParams.get('universeId');
        
        https.get(`https://games.roblox.com/v1/games/${universeId}/votes`, (apiRes) => {
            let data = '';
            apiRes.on('data', chunk => data += chunk);
            apiRes.on('end', () => {
                res.writeHead(200, {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                });
                res.end(data);
            });
        }).on('error', () => {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Failed to fetch' }));
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not found - use /likes?universeId=YOUR_ID');
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log('Proxy running on port ' + PORT));
