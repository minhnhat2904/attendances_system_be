import QRCode from 'qrcode';
import { db } from '../models';
import { HttpError } from '../utils';
const { QueryTypes } = require('sequelize');
import cloudinary from 'cloudinary';
import generator from 'generate-password';

cloudinary.v2.config({
    cloud_name: 'articlesgroup',
    api_key: '567228543314488',
    api_secret: 'DKHdpzz88eeBGKFR4N10_ROO0jM'
});
const QRCodeDB = db.qrCode;

const create = async (req, res, next) => {
	let key = generator.generate({length: 10, numbers: true});;
    let urlBase = await QRCode.toDataURL(key);
    let url = '';

    try {
        const success = await cloudinary.v2.uploader.upload(urlBase, {
            resource_type: "image",
            folder: "QRCode"
        })
        if (success) {
            url = success.url;
            const qrCode = await QRCodeDB.create({
                url,
                key
            });
            return res.status(200).json({
                status: true,
                message: 'Success',
                data: qrCode
            })
        }
        return res.status(400).send({ message: 'Failed to create qr code!' });
    } catch (error) {
        console.log(error);
    }
}

const get = async (req, res, next) => {
    try {
        const createdAt = req.query.createdAt;
        const qr = await db.sequelize.query('SELECT * FROM "qrCodes" WHERE "createdAt"::date = :createdAt AND "deletedFlag" = false',
            {
                replacements: { createdAt: createdAt },
                type: QueryTypes.SELECT,
                logging: console.log 
            });
        if (qr.length === 0) {
            throw new HttpError("Not found", 400);
        }

        res.status(200).json({
            status: 200,
            msg: "Success",
            data: qr,
        });
    } catch (error) {
        next(error);
    }
}

export const qrCodeController = {
	create,
    get
};