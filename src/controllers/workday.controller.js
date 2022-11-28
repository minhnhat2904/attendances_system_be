import { db } from '../models';
import { HttpError } from '../utils';
const { QueryTypes } = require('sequelize');

const WorkDay = db.workDay;
const QRCode = db.qrCode;

const create = async (req, res, next) => {
    let key = req.body.key;
    const user = req.user;
    try {
        const qrCode = await QRCode.findOne({
            where: {
                key,
            }
        });
        if (qrCode) {
            const now = new Date().toISOString().slice(0, 10);
            const dateCreated = new Date(qrCode.createdAt).toISOString().slice(0, 10);
            if (now === dateCreated) {
                const alreadyAttendances = await db.sequelize.query('SELECT * FROM "workDays" WHERE "userId" = :userId AND "qrCodeId" = :qrCodeId AND "deletedFlag" = false',
                    {
                        replacements: { userId: req.user.id, qrCodeId: qrCode.id },
                        type: QueryTypes.SELECT,
                        logging: console.log
                    });
                if (alreadyAttendances) {
                    throw new HttpError('You are already attendances today', 400);
                }
                const workDay = await WorkDay.create({
                    qrCodeId: qrCode.id,
                    userId: user.id,
                    checkIn: new Date(),
                    checkOut: (new Date()).setHours(17, 0, 0, 0),
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
            status: 200,
            msg: "Success",
            data: workDay,
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
            status: 200,
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
    getTotalHourWork
};