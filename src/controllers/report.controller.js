import { db } from '../models';
import { HttpError } from '../utils';

const Report = db.report;

const create = async (req, res, next) => {
	const { date, project, ticket, task, time, note } = req.body;
    const user = req.user;
    
    try {
        const report = await Report.create({
            userId: user.id,
            date,
            project,
            ticket,
            task,
            time,
            note,
            insertedBy: user.username,
            updatedBy: user.username
        });
        if (!report) {
            throw new HttpError('Cannot create report.', 400);
        }
        return res.status(200).json({
            status: true,
            message: 'Success',
            data: report
        })
    } catch (error) {
        next(error);
    }
}

export const reportController = {
	create
};