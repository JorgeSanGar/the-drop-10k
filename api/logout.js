const ALLOWED_ORIGINS = [
    'https://thedrop10k.space',
    'https://www.thedrop10k.space',
    'http://localhost:3000'
];

module.exports = async (req, res) => {
    const origin = req.headers.origin;
    if (ALLOWED_ORIGINS.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Vary', 'Origin');
    }
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Clear cookie
    const isProd = process.env.NODE_ENV === 'production';
    const cookieOptions = [
        'drop_session=',
        'HttpOnly',
        'Path=/',
        'Max-Age=0',
        'SameSite=Lax'
    ];

    if (isProd) {
        cookieOptions.push('Secure');
    }

    res.setHeader('Set-Cookie', cookieOptions.join('; '));
    res.status(200).json({ ok: true });
};
