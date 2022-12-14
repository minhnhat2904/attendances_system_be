import bcrypt from 'bcryptjs';
import { HttpError, tokenEncode } from '../utils';
import { db } from '../models';
import QRCode from 'qrcode';
import readXlsxFile from 'read-excel-file/node'
import { QueryTypes } from 'sequelize';

const Admin = db.admin;
const Account = db.account;
const Permission = db.permission;
const UserPermission = db.userPermission;
const Department = db.department;

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
	let { username, password, role, department, name, birthday, phone, address } = req.body;
	role = role.join();
	username = username.toLowerCase();
	try {
		const isExist = await Account.findOne({ where: { username } });
		if (isExist) {
            throw new HttpError('Username is exist', 400);
        }
		const hash = await bcrypt.hash(password, 12);
		if (!hash) {
            throw new HttpError('Failed', 400);
        }
		const isExistDepartment = await Department.findOne({ where: { id: department } });
		if (!isExistDepartment) {
			throw new HttpError('Not found department', 400);
		}

		const account = await Account.create({
			username,
			password: hash,
			role: role,
			department: isExistDepartment.id,
			name,
			birthday,
			phone,
			address
		});
		if (role.includes('head_department')) {
			await isExistDepartment.update({userId: account.id});
			await isExistDepartment.save();
		}
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

const createUserByFile = async (req, res, next) => {
	if (req.file == undefined) {
		return res.status(400).send("Please upload an excel file!");
	}
	let path = __dirname + "/../resources/static/assets/uploads/" + req.file.filename;
	readXlsxFile(path).then((rows) => {
		rows.shift();

		rows.forEach(async (row) => {
			const isExistDepartment = await Department.findOne({ where: { name: row[6] } });
			if (!isExistDepartment) {
				throw new HttpError('Not found department', 400);
			}
			const role = row[5] + ''
			const hash = await bcrypt.hash(row[1] + '', 12);
			const account = await Account.create({
				username: row[0],
				password: hash,
				role: row[5],
				department: isExistDepartment.id,
				name: row[2],
				birthday: row[3] + '',
				phone: row[4],
				address: row[7]
			});
			if (role.includes('head_department')) {
				await isExistDepartment.update({userId: account.id});
				await isExistDepartment.save();
			}
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
		})
	});
	res.status(200).json({
		status: true,
		message: 'Success',
		data: "OK",
	})
}

const updateUser = async (req, res, next) => {
	let id = req.params.id;
	try {
		const isExist = await Account.findOne({ where: { id } });
		if (!isExist) {
            throw new HttpError('Account is not exist', 400);
        }

		const isExistDepartment = await Department.findOne({ where: { id: req.body.department } });
		if (!isExistDepartment) {
			throw new HttpError('Not found department', 400);
		}
		req.body.department = isExistDepartment.id;
		req.body.role = req.body.role.join();
		
		const account = await Account.update(req.body, { where: { id }});

		res.status(200).json({
			status: true,
			msg: 'Update user success',
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

const get = async (req, res, next) => {
	try {
        const department = req.query.department;
		const username = req.query.username;

		let query = 'WHERE "accounts"."deleted_flag" = false';
		query += (department == undefined) ? '' : ` AND "accounts"."department" = \'${department}\'`;
		query += (username == undefined) ? '' : ` AND "accounts"."username" LIKE \'%${username}%\'`;

		let users = [];

		users = await db.sequelize.query(
			`
				SELECT * FROM "accounts"
				${query}
			`,
            {
                type: QueryTypes.SELECT,
                logging: console.log
            });

        return res.status(200).json({
            status: true,
            message: 'Success',
            data: users
        })
    } catch (error) {
        console.log(error);
    }
}

const getUserForAccountancy = async (req, res, next) => {
	try {
		const department = req.query.department;
		const username = req.query.username;

		let query = 'WHERE "accounts"."deleted_flag" = false';
		query += (department == undefined) ? '' : ` AND ("accounts"."department" = \'${department}\'`;
		query += (username == undefined) ? '' : ` OR "accounts"."username" LIKE \'%${username}%\')`;

		let users = [];

		let result = await db.sequelize.query(
			`
				SELECT * FROM "accounts"
				${query}
			`,
            {
                type: QueryTypes.SELECT,
                logging: console.log
            }
		);
		
		for (let index = 0; index < result.length; index++) {
			let hourOffAnnual = await db.sequelize.query(
				`
					SELECT SUM(CAST("leaves"."amountDay" AS DECIMAL )) AS d, SUM(CAST("leaves"."amountHour" AS DECIMAL )) AS h FROM "leaves"
					WHERE "leaves"."typeOff" = 'Annual leave';
				`,
				{
					type: QueryTypes.SELECT,
				}
			);
			let hourOffUnpaid = await db.sequelize.query(
				`
					SELECT SUM(CAST("leaves"."amountDay" AS DECIMAL )) AS d, SUM(CAST("leaves"."amountHour" AS DECIMAL )) AS h FROM "leaves"
					WHERE "leaves"."typeOff" = 'Unpaid leave' AND "leaves"."userId" = :userId;
				`,
				{
					replacements: { userId: result[index].id},
					type: QueryTypes.SELECT,
				}
			);
			console.log(hourOffUnpaid);
			let user = {
				name: result[index].name,
				username: result[index].username,
				hours_off_annual: Number(hourOffAnnual[0].d) * 8 + Number(hourOffAnnual[0].h),
				hours_off_unpaid: Number(hourOffUnpaid[0].d) * 8 + Number(hourOffUnpaid[0].h),
			}
			users.push(user);
		}

        return res.status(200).json({
            status: true,
            message: 'Success',
            data: users
        })
	} catch (error) {
		console.log(error);
	}
}

export const adminController = {
	login,
	createUser,
	updateUser,
	createQrCode,
	get,
	createUserByFile,
	getUserForAccountancy
};