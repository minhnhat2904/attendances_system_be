import { db } from '../models';
import { HttpError } from '../utils';
const { QueryTypes } = require('sequelize');

const WorkDay = db.workDay;
const QRCode = db.qrCode;

const create = async (req, res, next) => {
    console.log(req.body);
    let key = req.body.key;
    const user = req.user;
    try {
        const qrCode = await db.sequelize.query(`
            SELECT * FROM "public"."qrCodes" WHERE "key" = '${key}';
        `,
        {
            type: QueryTypes.SELECT,
            logging: console.log
        });
        if (qrCode) {
            const now = new Date().toISOString().slice(0, 10);
            const dateCreated = new Date(qrCode[0].createdAt).toISOString().slice(0, 10);
            if (now === dateCreated) {
                const alreadyAttendances = await db.sequelize.query('SELECT * FROM "workDays" WHERE "userId" = :userId AND "qrCodeId" = :qrCodeId AND "deletedFlag" = false',
                    {
                        replacements: { userId: req.user.id, qrCodeId: qrCode[0].id },
                        type: QueryTypes.SELECT,
                        logging: console.log
                    });
                if (alreadyAttendances.length !== 0) {
                    throw new HttpError('You are already attendances today', 400);
                }
                const workDay = await WorkDay.create({
                    qrCodeId: qrCode[0].id,
                    userId: user.id,
                    checkIn: new Date(),
                    checkOut: (new Date()).setHours(10, 0, 0, 0),
                    insertedBy: user.username,
                    status: 1
                });
                return res.status(200).json({
                    status: true,
                    message: 'Success',
                    data: workDay
                })
            }
        }
        throw new HttpError('QR code is uncorrect', 400);
    } catch (error) {
        next(error);
    }
}

const get = async (req, res, next) => {
    try {
        const userId = req.query.userId;
        const workDays = await db.sequelize.query('SELECT * FROM "workDays" WHERE "userId" = :userId AND "deletedFlag" = false',
            {
                replacements: { userId: userId },
                type: QueryTypes.SELECT,
                logging: console.log
            });
        return res.status(200).json({
            status: true,
            message: 'Success',
            data: workDays
        })
    } catch (error) {
        console.log(error);
    }
}

const getById = async (req, res, next) => {
    try {
        const id = req.params.id;
        let workDay = await WorkDay.findOne({ where: { id: id, deletedFlag: false } })

        if (!workDay) {
            throw new HttpError("Not found", 400);
        }

        res.status(200).json({
            status: true,
            msg: "Success",
            data: workDay,
        });
    } catch (error) {
        next(error);
    }
}

const getByDepartment = async (req, res, next) => {
    try {
        const { department } = req.params;
        const { startDate, endDate } = req.query;
        let query = 'WHERE "workDays"."deletedFlag" = false';
        query += (startDate == '') ? '' : ` AND "workDays"."createdAt" <= \'${startDate}\'`;
        query += (endDate == '') ? '' : ` AND "workDays"."createdAt" >= \'${endDate}\'`;
        query += (department == '') ? '' : ` AND "accounts"."department" = \'${department}\'`;
        query += ' ORDER BY "workDays"."createdAt" DESC';
        let report = await db.sequelize.query(
			`
				SELECT 
                    "workDays"."checkIn",
                    "workDays"."checkOut",
                    "workDays"."createdAt",
                    "accounts"."username"
                FROM "workDays"
                LEFT JOIN "accounts" ON "workDays"."userId"::text = "accounts"."id"::text
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

const update = async (req, res, next) => {
    const id = req.params.id;
    try {
        const report = await WorkDay.update(req.body,
            { where: { id: id } });
        if (!report) {
            throw new HttpError('Cannot update workday permits.', 400);
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

const destroy = async (req, res, next) => {
    try {
        const ids = req.body.ids;
        const result = await db.sequelize.query('UPDATE "workDays" SET "deletedFlag" = true WHERE "id" IN (:ids) AND "deletedFlag" = false',
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

const getTotalHourWork = async () => {

}

export const workDayController = {
    create,
    get,
    getById,
    update,
    destroy,
    getTotalHourWork,
    getByDepartment
};
