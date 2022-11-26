import { db } from '../models';
import fs from 'fs';
import log from 'datalog';
import { envVariables } from '../configs';
import bcrypt from 'bcryptjs';
import path from 'path';
import csv from 'csv-parser';

const Admin = db.admin;
const Permission = db.permission;
const UserPermission = db.userPermission;

export const initAccountAdmin = async () => {
    try {
        const count = await Permission.count();
        if (count == 0) {
            await initPermission();
        } else {
            log.info('Permissions are already');
        }

        let admin = await Admin.findOne({ where: {
            username: envVariables.usernameAdmin 
        }});
        if (admin) {
            log.info('Account admin is already');
            return;
        }

        const password = envVariables.passwordAdmin;
        const hash = await bcrypt.hash(password, 12);
        admin = await Admin.create({
            username: envVariables.usernameAdmin,
            password: hash,
            role: 'admin',
        })

        let permissions = await Permission.findAll({ where: {
            role: 'admin', check : true
        }});
        permissions = permissions.map((permission) => {
            const userPermission = {
                userId: admin.id,
				permissionId: permission.id,
				permissionName: permission.permissionName,
				actionCode: permission.actionCode,
				check: true,
            };
			return UserPermission.create(userPermission);
		});
		await Promise.all(permissions);
		log.info(`Account admin has been created.`);
    } catch (error) {
        log.error(error);
    }
}

const initPermission = async () => {
    try {
        let filePath = '../resources/csv/permission.csv';
        filePath = path.resolve(__dirname, filePath);
        if(!fs.existsSync(filePath)) {
            log.warn('File do not exist!');
            return;
        }
        const results = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', async () => {
                log.info('Read file csv success');
                const permissions = results.map(permission => {
                    permission.check = parseInt(permission.check);
                    Permission.create(permission);
                })
                await Promise.all(permissions);
                log.info(`Create ${permissions.length} permission success`);
            })
    } catch (error) {
        log.error(error);
    }
}