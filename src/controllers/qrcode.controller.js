import QRCode from 'qrcode';
import { db } from '../models';
import cloudinary from 'cloudinary';

cloudinary.v2.config({
    cloud_name: 'articlesgroup',
    api_key: '567228543314488',
    api_secret: 'DKHdpzz88eeBGKFR4N10_ROO0jM'
});
const QRCodeDB = db.qrCode;

const create = async (req, res, next) => {
	let secret = "Code to attendance";
    let urlBase = await QRCode.toDataURL(secret);
    let url = '';

    try {
        const success = await cloudinary.v2.uploader.upload(urlBase, {
            resource_type: "image",
            folder: "QRCode"
        })
        if (success) {
            url = success.url;
            const qrCode = await QRCodeDB.create({
                url
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

export const qrCodeController = {
	create
};