import jwt from 'jsonwebtoken';

const generateTokens = (id) => {
    const accessToken = jwt.sign({ id }, process.env.JWT_ACCESS_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES,
    });

    const refreshToken = jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES,
    });

    return { accessToken, refreshToken };
};

export default generateTokens;
