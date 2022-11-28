import { db } from '../models';
import { HttpError } from '../utils';
const { QueryTypes } = require('sequelize');

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

const update = async (req, res, next) => {
    const id = req.params.id;
    try {
        const report = await Report.update(req.body,
        { where: { id: id } });
        if (!report) {
            throw new HttpError('Cannot update leave permits.', 400);
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

const get = async (req, res, next) => {
    try {
        const userId = req.query.userId;
        let report = await Report.findAll({ where: {userId: userId, deletedFlag: false }})
        
        if (report.length === 0) {
            throw new HttpError("Not found", 400);
        }

        res.status(200).json({
            status: 200,
            msg: "Success",
            data: report,
        });
    } catch (error) {
        next(error);
    }
}

const getById = async (req, res, next) => {
    try {
        const id = req.params.id;
        let report = await Report.findOne({ where: {id: id, deletedFlag: false }})
        
        if (!report) {
            throw new HttpError("Not found", 400);
        }

        res.status(200).json({
            status: 200,
            msg: "Success",
            data: report,
        });
    } catch (error) {
        next(error);
    }
}

const destroy = async (req, res, next) => {
    try {
        const ids = req.body.ids;
        const result = await db.sequelize.query('UPDATE "reports" SET "deletedFlag" = true WHERE "id" IN (:ids) AND "deletedFlag" = false',
            {
                replacements: { ids: ids },
                type: QueryTypes.UPDATE,
                logging: console.log 
            });
        
        if (!result) {
            throw new HttpError("Not found", 400);
        }

        res.status(200).json({
            status: 200,
            msg: "Success",
            data: result,
        });
    } catch (error) {
        next(error);
    }
}

export const reportController = {
	create,
    update,
    get,
    getById,
    destroy,
};
