import { HttpError, tokenEncode } from "../utils";
import bcrypt from "bcryptjs";
import { db } from '../models';
import generator from 'generate-password';

const Account = db.account;

const login = async (req, res, next) => {
    let { username, password } = req.body;
    username = username.toLowerCase();

    try {
        const user = await Account.findOne({ where: {username, deleted_flag: false }})

        if (!user) {
            throw new HttpError("Email have not already registered", 400);
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            throw new HttpError("Password is uncorrect", 400);
        }

        let data = {
            username: user.username,
            id: user.id,
            role: user.role,
        };

        const token = tokenEncode(data);

        res.status(200).json({
            status: true,
            msg: "Success",
            data: token
        });
    } catch (error) {
        next(error);
    }
};

const updatePassword = async (req, res, next) => {
    const { password, newPassword } = req.body;
    const { username } = req.user;
    try {
        let user = await Account.findOne({ where: {username, deleted_flag: false }})

        if (!user) {
            throw new HttpError("User not found", 400);
        }
        const match = await bcrypt.compare(password, user.password);

        if(!match) {
            throw new HttpError("Password is incorrect", 400);
        }
        
        const hash = await bcrypt.hash(newPassword, 12);
        const result = await Account.update(
            { password: hash },
            { where: { id: user.id } }
        )
        res.status(200).json({
            status: 200,
            msg: "Success",
            data: result
        });
    } catch (error) {
        next(error);
    }
};

const resetPassword = async (req, res, next) => {
    const { username } = req.user;
    try {
        let user = await Account.findOne({ where: {username, deleted_flag: false }})

        if (!user) {
            throw new HttpError("User not found", 400);
        }
        const password = generator.generate({length: 10, numbers: true});
        const hash = await bcrypt.hash(password, 12);
        const result = await Account.update(
            { password: hash },
            { where: { id: user.id } }
        )
        res.status(200).json({
            status: 200,
            msg: "Success",
            data: password
        });
    } catch (error) {
        next(error);
    }
}

const profile = async (req, res, next) => {
    const { id } = req.user;
    try {
        let user = await Account.findOne({ where: {id, deleted_flag: false }})
        
        if (!user) {
            throw new HttpError("user not found", 400);
        }

        res.status(200).json({
            status: 200,
            msg: "Success",
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

const updateProfile = async (req, res, next) => {
    const { id } = req.user;
    let user = await Account.findOne({ where: {id, deleted_flag: false }})
    if (!user) {
        throw new HttpError("User not found", 400);
    }
    const result = await Account.update(
        req.body,
        { where: { id: user.id } }
    )
    
    res.status(200).json({
        status: 200,
        msg: "Success",
        data: result
    });
};

export const authController = {
    login,
    updatePassword,
    resetPassword,
    profile,
    updateProfile,
};
