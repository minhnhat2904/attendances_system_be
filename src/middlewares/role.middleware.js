import { HttpError, checkRoleAndPermision } from "../utils";

const checkPermission = (permissionCode) => async (req, res, next) => {
    try {
		const hasPermission = await checkRoleAndPermision(req.user.id, permissionCode);
        if (!hasPermission) {
            throw new HttpError("Deny permission", 401);
        }
        next();
    } catch (error) {
        next(error);
    }
};

export const roleMiddleware = {
    checkPermission,
};