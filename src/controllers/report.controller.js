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
        const { userId, startDate, endDate } = req.query;
        let query = 'WHERE "reports"."deletedFlag" = false';
        query += (startDate == '') ? '' : ` AND "reports"."date" >= \'${startDate}\'`;
        query += (endDate == '') ? '' : ` AND "reports"."date" <= \'${endDate}\'`;
        query += (userId == '') ? '' : ` AND "reports"."userId" = \'${userId}\'`;
        let report = await db.sequelize.query(
			`
				SELECT * FROM "reports"
				${query}
			`,
            {
                type: QueryTypes.SELECT,
                logging: console.log
            });

        res.status(200).json({
            status: true,
            msg: "Success",
            data: report,
        });
    } catch (error) {
        next(error);
    }
}
const getAll = async (req, res, next) => {
    try {
        const { department, startDate, endDate } = req.query;
        let query = 'WHERE "reports"."deletedFlag" = false';
        query += (startDate == '') ? '' : ` AND ("reports"."date" <= \'${startDate}\'`;
        query += (endDate == '') ? '' : ` AND "reports"."date" >= \'${endDate}\'`;
        query += (department == '') ? '' : ` AND "accounts"."department" = \'${department}\'`;
        let report = await db.sequelize.query(
			`
				SELECT 
                    "reports"."date",
                    "reports"."time",
                    "reports"."task",
                    "reports"."ticket",
                    "reports"."project",
                    "reports"."note",
                    "accounts"."username"
                FROM "reports"
                LEFT JOIN "accounts" ON "reports"."userId"::text = "accounts"."id"::text
				${query}
			`,
            {
                type: QueryTypes.SELECT,
                logging: console.log
            });

        res.status(200).json({
            status: true,
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
            status: true,
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
            status: true,
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
    getAll,
    getById,
    destroy,
};
