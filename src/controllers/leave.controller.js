import { db } from '../models';
import { HttpError } from '../utils';

const Leave = db.leave;

const create = async (req, res, next) => {
    const { startDate, endDate, typeOff, reason, reasonDetail, status, receiver } = req.body;
    const user = req.user;
    try {
        const leave = await Leave.create({
            userId: user.id,
            startDate,
            endDate,
            typeOff,
            reason,
            reasonDetail,
            status,
            receiver
        });
        if (!leave) {
            throw new HttpError('Cannot create leave permits.', 400);
        }
        return res.status(200).json({
            status: true,
            message: 'Success',
            data: leave
        })
    } catch (error) {
        next(error);
    }
}

export const leaveController = {
	create
};