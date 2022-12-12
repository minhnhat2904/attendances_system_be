import { QueryTypes } from 'sequelize';
import { db } from '../models';
import { HttpError } from '../utils';

const get = async (req, res, next) => {
    try {
        const departments = await db.sequelize.query('SELECT * FROM "Departments" WHERE "deletedFlag" = false',
            {
                type: QueryTypes.SELECT,
                logging: console.log
            });

        res.status(200).json({
            status: true,
            msg: "Success",
            data: departments,
        });
    } catch (error) {
        next(error);
    }
}

export const departmentController = {
    get
};