import { authMiddleware, validateRequestBody, roleMiddleware, uploadFile } from '../middlewares';
import { adminController, qrCodeController, workDayController, authController, reportController, departmentController } from '../controllers';
import { Router } from 'express';
import constants from '../constants';
import { leaveController } from '../controllers/leave.controller';

const { ACTION_CODE } = constants;

const { jwtMiddleware } = authMiddleware;
const { checkPermission } = roleMiddleware;

export const router = Router();

// ADMIN
router.route('/api/admin/login').post(validateRequestBody.loginAdminRequest, adminController.login);

// USER
router.route('/api/users').post(
    jwtMiddleware,
    checkPermission(ACTION_CODE.CREATE_USER),
    validateRequestBody.createUserRequest,
    adminController.createUser
);

router.route('/api/users/file').post(
    jwtMiddleware,
    checkPermission(ACTION_CODE.CREATE_USER),
    uploadFile.single('file'),
    adminController.createUserByFile
);

router.route('/api/users').get(
    jwtMiddleware,
    // checkPermission(ACTION_CODE.GET_USERS),
    adminController.get
);
router.route('/api/users/getUserForAccountancy').get(
    jwtMiddleware,
    // checkPermission(ACTION_CODE.GET_USERS),
    adminController.getUserForAccountancy
);

router.route('/api/users/:id').put(
    jwtMiddleware,
    checkPermission(ACTION_CODE.UPDATE_USERS),
    adminController.updateUser
);

// AUTH
router.route('/api/auth/login').post(
    authController.login
);

router.route('/api/auth/updatePassword').put(
    jwtMiddleware,
    authController.updatePassword
);

router.route('/api/auth/resetPassword').put(
    jwtMiddleware,
    authController.resetPassword
);

router.route('/api/auth/profile').get(
    jwtMiddleware,
    authController.profile
);

router.route('/api/auth/profile').put(
    jwtMiddleware,
    authController.updateProfile
);

// QRCODE
router.route('/api/qrcodes').post(
    jwtMiddleware,
    checkPermission(ACTION_CODE.CREATE_QR),
    qrCodeController.create
);

router.route('/api/qrCodes').get(
    jwtMiddleware,
    qrCodeController.get
)

// WORKDAY
router.route('/api/workdays').post(
    jwtMiddleware,
    workDayController.create
)

router.route('/api/workdays').get(
    jwtMiddleware,
    workDayController.get
)

router.route('/api/workdays/:id').get(
    jwtMiddleware,
    workDayController.getById
)

router.route('/api/workdays/:id').put(
    jwtMiddleware,
    workDayController.update
)

router.route('/api/workdays').delete(
    jwtMiddleware,
    workDayController.destroy
)

// LEAVE
router.route('/api/leaves').post(
    jwtMiddleware,
    leaveController.create
)

router.route('/api/leaves/:id').put(
    jwtMiddleware,
    leaveController.update
)

router.route('/api/leaves').get(
    jwtMiddleware,
    leaveController.get
)

router.route('/api/leaves/:id').get(
    jwtMiddleware,
    leaveController.getById
)

router.route('/api/leaves').delete(
    jwtMiddleware,
    leaveController.destroy
)

// REPORT
router.route('/api/reports').post(
    jwtMiddleware,
    reportController.create
)

router.route('/api/reports/:id').put(
    jwtMiddleware,
    reportController.update
)

router.route('/api/reports').get(
    jwtMiddleware,
    reportController.get
)

router.route('/api/reports/:id').get(
    jwtMiddleware,
    reportController.getById
)

router.route('/api/reports').delete(
    jwtMiddleware,
    reportController.destroy
)

router.route('/api/totalHourWork').get(
    jwtMiddleware,
    workDayController.getTotalHourWork
)

// DEPARTMENT
router.route('/api/departments').get(
    jwtMiddleware,
    departmentController.get
)
