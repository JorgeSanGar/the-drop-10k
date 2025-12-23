const jwt = require('jsonwebtoken');

function parseCookies(req) {
    const list = {};
    const rc = req.headers.cookie;

    rc && rc.split(';').forEach(function (cookie) {
        const parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });

    return list;
}

function signSession(payload) {
    if (!process.env.JWT_SECRET) {
        throw new Error('Server misconfigured: JWT_SECRET missing');
    }
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
}

function verifySession(token) {
    if (!process.env.JWT_SECRET) {
        throw new Error('Server misconfigured: JWT_SECRET missing');
    }
    return jwt.verify(token, process.env.JWT_SECRET);
}

function requireAuth(req, res) {
    if (!process.env.JWT_SECRET) {
        res.status(500).json({ error: 'Server misconfigured' });
        return null;
    }

    const cookies = parseCookies(req);
    const token = cookies.drop_session;

    if (!token) {
        res.status(401).json({ error: 'Unauthorized' });
        return null;
    }

    try {
        const session = verifySession(token);
        return session;
    } catch (error) {
        res.status(401).json({ error: 'Invalid session' });
        return null;
    }
}

module.exports = {
    parseCookies,
    signSession,
    verifySession,
    requireAuth
};
