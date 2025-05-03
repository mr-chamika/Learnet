const crypto = require('crypto');

function generateSignedUrl(filename) {
    const expiry = Math.floor(Date.now() / 1000) + 60 * 10; // 10 minutes expiry
    const secret = 'your-secret-key';
    const signature = crypto
        .createHmac('sha256', secret)
        .update(`${filename}:${expiry}`)
        .digest('hex');

    return `http://localhost:8080/stream/video/${filename}?expiry=${expiry}&signature=${signature}`;
}

app.get('/generate-video-url/:filename', authenticateToken, (req, res) => {
    const signedUrl = generateSignedUrl(req.params.filename);
    res.json({ url: signedUrl });
});

app.get('/stream/video/:filename', (req, res) => {
    const { expiry, signature } = req.query;
    const filename = req.params.filename;

    if (!expiry || !signature) return res.sendStatus(403);

    const secret = 'your-secret-key';
    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(`${filename}:${expiry}`)
        .digest('hex');

    if (signature !== expectedSignature || Date.now() > expiry * 1000) {
        return res.sendStatus(403);
    }

    // Proceed to stream the video as before
});
