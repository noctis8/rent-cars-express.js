import rateLimit from 'express-rate-limit';

const loginLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,        // 5 tries in one minute 1 minute
    max: 5,
    keyGenerator: function (req) {
        return req.ip;
    },
    handler: function (req, res) {
        return res.status(429).json({
            message: "Too many login attempts, please try again later.",
        });
    },
});

export default loginLimiter;