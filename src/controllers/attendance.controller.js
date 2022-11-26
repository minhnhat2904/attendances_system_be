import bcrypt from 'bcryptjs';
import { request } from 'express';
import { HttpError, tokenEncode } from '../utils';

const attendance = async (req, res, next) => {
	const { qrCode } = req.body;
    try {
        res.status(200).json({
            status: 200,
            message: 'Success',
            data: 'True'
        })
    } catch (error) {
        next(error);
    }
}

export const attendanceController = {
	attendance
};