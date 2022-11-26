import jwt from 'jsonwebtoken';
import { envVariables } from '../configs';

const { jwtSecret } = envVariables;

export const tokenEncode = (data) => {
    return jwt.sign(data, jwtSecret);
}

export const verifyToken = (token) => {
	return jwt.verify(token, jwtSecret);
};