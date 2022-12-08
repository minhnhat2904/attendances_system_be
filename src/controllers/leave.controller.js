import { db } from '../models';
import { HttpError } from '../utils';
const { QueryTypes } = require('sequelize');

const Leave = db.leave;
const Account = db.account;

const create = async (req, res, next) => {
    const { startDate, endDate, typeOff, reason, reasonDetail, status, receiver, amountDay, amountHour } = req.body;
    const user = req.user;
    try {
        const exist = await db.sequelize.query(
            `SELECT * FROM "leaves" WHERE "userId" = :userId AND (("startDate" < '${startDate}') OR ("startDate" < '${endDate}')) AND (("endDate" > '${startDate}') OR ("endDate" > '${endDate}'))`,
            {
                replacements: { userId: req.user.id},
                type: QueryTypes.SELECT,
                logging: console.log
            });
            console.log(exist.length);
        if (exist.length !== 0) {
            throw new HttpError('Cannot create leave permits.', 400);
        }
        const account = await Account.findOne({ where: { id: user.id } })
        console.log(account.remainHours);
        console.log((amountDay*8 + amountHour));
        await Account.update({
            remainHours: parseFloat(account.remainHours - (amountDay*8 + amountHour)).toFixed(1)
        }, { where: { id: account.id } })
        const leave = await Leave.create({
            userId: req.user.id,
            startDate,
            endDate,
            typeOff,
            reason,
            reasonDetail,
            status,
            receiver,
            amountDay,
            amountHour
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

const update = async (req, res, next) => {
    const id = req.params.id;
    try {
        const leave = await Leave.update(req.body,
            { where: { id: id } });
        if (!leave) {
            throw new HttpError('Cannot update leave permits.', 400);
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

const get = async (req, res, next) => {
    try {
        const { startDate, endDate, status, userId } = req.query;
        // let leave = await Leave.findAll({ where: { userId: userId, deletedFlag: false } })
        let leave = await db.sequelize.query(
            'SELECT * FROM "leaves" WHERE ("userId" LIKE \'%%\') OR ("startDate" > :startDate) OR ("endDate" < :endDate) OR ("status" = :status)',
            {
                replacements: { userId: userId, startDate: startDate, endDate: endDate, status: status },
                type: QueryTypes.UPDATE,
                logging: console.log
            });

        res.status(200).json({
            status: true,
            msg: "Success",
            data: leave[0],
        });
    } catch (error) {
        next(error);
    }
}

const getById = async (req, res, next) => {
    try {
        const id = req.params.id;
        let leave = await Leave.findOne({ where: { id: id, deletedFlag: false } })

        if (!leave) {
            throw new HttpError("Not found", 400);
        }

        res.status(200).json({
            status: true,
            msg: "Success",
            data: leave,
        });
    } catch (error) {
        next(error);
    }
}

const destroy = async (req, res, next) => {
    try {
        const ids = req.body.ids;
        const result = await db.sequelize.query('UPDATE "leaves" SET "deletedFlag" = true WHERE "id" IN (:ids) AND "deletedFlag" = false',
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

export const leaveController = {
    create,
    update,
    get,
    getById,
    destroy,
};