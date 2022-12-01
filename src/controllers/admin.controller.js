import bcrypt from 'bcryptjs';
import { HttpError, tokenEncode } from '../utils';
import { db } from '../models';
import QRCode from 'qrcode';

const Admin = db.admin;
const Account = db.account;
const Permission = db.permission;
const UserPermission = db.userPermission;

const login = async (req, res, next) => {
	const { username, password } = req.body;
    try {
        const account = await Admin.findOne({ where: { username } });
        if (!account) {
            throw new HttpError('Username is uncorrect');
        }

        const match = await bcrypt.compare(password, account.password);
        if (!match) {
            throw new HttpError('Password is uncorrect');
        }
        const data = {
            username,
            id: account.id,
            role: account.role,
        };
        const token = tokenEncode(data);
        res.status(200).json({
            status: true,
            message: 'Success',
			data: token,
        })
    } catch (error) {
        next(error);
    }
}

const createUser = async (req, res, next) => {
	let { username, password, role } = req.body;
	username = username.toLowerCase();
	try {
		const isExist = await Account.findOne({ where: { username } });
		if (isExist) {
            throw new HttpError('Username is exist', 400);
        }
		const hash = await bcrypt.hash(password, 12);
		if (!hash) {
            throw new HttpError('Fail', 400);
        }
		const account = await Account.create({
			username,
			password: hash,
			role: role,
		});
		let permissions = await Permission.findAll({where: {
			role,
			check: true,
		}});
		permissions = permissions.map((permission) => {
			return UserPermission.create({
				userId: account.id,
				permissionId: permission.id,
				permissionName: permission.permissionName,
				actionCode: permission.actionCode,
				check: true,
			});
		});
		await Promise.all(permissions);

		res.status(200).json({
			status: true,
			msg: 'Create user success',
		});
	} catch (error) {
		next(error);
	}
}

const createQrCode = async (req, res, next) => {
	let img = '';
	let secret = "Code to attendance";
    let qr = await QRCode.toDataURL(secret);
    img = `<image src= " ` + qr + `" />`
    return res.send(img);
}

export const adminController = {
	login,
	createUser,
	createQrCode
};