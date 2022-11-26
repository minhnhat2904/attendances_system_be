import log from "datalog";
export const Permission = (sequelize, Sequelize) => {
    const Permission = sequelize.define("permission", {
        id: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
        },
        role: {
            type: Sequelize.STRING
        },
        permissionName: {
            type: Sequelize.STRING
        },
        actionCode: {
            type: Sequelize.STRING
        },
        check: {
            type: Sequelize.BOOLEAN,
            default: true
        },
    }, {});

    Permission.associate = function (models) {
        Permission.belongsToMany(models.Account, {
            through: "userPermission",
            as: 'account',
            foreignKey: 'userId',
        });
    };

    return Permission;
};
