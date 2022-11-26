export const UserPermission = (sequelize, Sequelize) => {
    const UserPermission = sequelize.define("userPermission", {
        userId: {
            type: Sequelize.UUID
        },
        permissionId: {
            type: Sequelize.UUID
        },
        permissionName: {
            type: Sequelize.STRING,
            default: "admin",
        },
        actionCode: {
            type: Sequelize.STRING,
        },
        check: {
            type: Sequelize.BOOLEAN,
        },
    }, {});

    return UserPermission;
};
