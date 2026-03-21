import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const generateTokens = (id, ip = '') => {
    const jti = crypto.randomUUID();

    const accessToken = jwt.sign({ id, jti, ip }, process.env.JWT_ACCESS_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES || '15m',
        algorithm: 'HS256',
    });

    const refreshToken = jwt.sign({ id, jti, ip }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES || '7d',
        algorithm: 'HS256',
    });

    return { accessToken, refreshToken };
};

export default generateTokens;
