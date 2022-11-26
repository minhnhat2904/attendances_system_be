import { verifyToken, HttpError } from "../utils";

const jwtMiddleware = async (req, res, next) => {
    try {
        if(!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
            throw new HttpError('No token, authorization denied', 401);
        }
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decodedToken = verifyToken(token);
            req.user = decodedToken;
            next();
        } catch (error) {
            throw new HttpError('Token is invalid', 400);
        }
    } catch (error) {
        next(error);
    }
};

export const authMiddleware = {
    jwtMiddleware,
}