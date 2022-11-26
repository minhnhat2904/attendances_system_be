import { db } from '../models';
import { HttpError } from '../utils';
const { QueryTypes } = require('sequelize');

const WorkDay = db.workDay;
const QRCode = db.qrCode;

const create = async (req, res, next) => {
	// const { qrCode } = req.body;
    let qrCode = "11c08acf-b322-4c8d-9aaa-64456c69105d";
    const user = req.user;
    try {
        console.log(qrCode);
        const isExist = await QRCode.findOne({ where: {
                id: qrCode,
            } 
        });
        console.log(isExist);
        if (isExist) {
            const now = new Date().toISOString().slice(0, 10);
            const dateCreated = new Date(isExist.createdAt).toISOString().slice(0, 10);
            if (now === dateCreated) {
                const workDay = await WorkDay.create({
                    qrCodeId: qrCode,
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

const getByUser = async (req, res, next) => {
    try {
        const user = req.user;
        const workDays = await db.sequelize.query('SELECT * FROM "workDays" WHERE "userId" = :userId AND "deletedFlag" = false',
            {
                replacements: { userId: user.id },
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

const getAll = async (req, res, next) => {
    try {
        const workDays = await db.sequelize.query('SELECT * FROM "workDays" WHERE "userId" LIKE :userId AND "deletedFlag" = false',
            {
                replacements: { userId: req.body.userId ? req.body.userId: '%%' },
                type: QueryTypes.SELECT
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

const update = async (req, res, next) => {

}

export const workDayController = {
	create,
    getByUser,
    getAll
};