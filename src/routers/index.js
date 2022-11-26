import { authMiddleware, validateRequestBody, roleMiddleware } from '../middlewares';
import { adminController, qrCodeController, workDayController, authController, reportController } from '../controllers';
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

router.route('/api/users').put(
    jwtMiddleware,
    checkPermission(ACTION_CODE.UPDATE_USER),
    validateRequestBody.createUserRequest,
    adminController.createUser
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
router.route('/api/qrcode').post(
    jwtMiddleware,
    checkPermission(ACTION_CODE.CREATE_QR),
    qrCodeController.create
);

// WORKDAY
router.route('/api/workday').post(
    jwtMiddleware,
    workDayController.create
)

router.route('/api/workday/user').get(
    jwtMiddleware,
    workDayController.getByUser
)

router.route('/api/workday').get(
    jwtMiddleware,
    workDayController.getAll
)

// LEAVE
router.route('/api/leave').post(
    jwtMiddleware,
    leaveController.create
)

// REPORT
router.route('/api/report').post(
    jwtMiddleware,
    reportController.create
)
